import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { EmailService } from 'src/email-notification/email.service';
import { CustomLogger } from 'src/log/logs.service';
import { WalletRepository } from 'src/domain/repository/wallet.repository';
import { Wallet } from 'src/domain/entities/wallet.model';

@Injectable()
export class RabbitMQListenerService implements OnModuleInit {
  private readonly queueName = 'otp-queue';
  private readonly url = 'amqp://guest:guest@localhost';
  private readonly walletQueueName = 'wallet-queue';

  constructor(
    private readonly logger: CustomLogger,
    private readonly emailService: EmailService,
    private readonly walletRepository: WalletRepository,
  ) {
    this.logger.setContext(RabbitMQListenerService.name);
  }

  async onModuleInit(): Promise<void> {
    try {
      const connection = await amqp.connect(this.url);
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queueName);
      await channel.assertQueue(this.walletQueueName);

      // OTP queue consumer
      await channel.consume(
        this.queueName,
        (msg: amqp.ConsumeMessage | null): void => {
          if (msg) {
            void (async () => {
              try {
                const payload = JSON.parse(msg.content.toString()) as {
                  to: string;
                  otp: string;
                  subject: string;
                  type: string;
                };

                this.logger.log(`Message received: ${JSON.stringify(payload)}`);

                if (payload.type === 'EMAIL_VERIFICATION') {
                  await this.emailService.sendOTPEmail(
                    payload.to,
                    payload.otp,
                    payload.subject,
                    channel,
                    msg,
                  );
                }
              } catch (error) {
                const err = error as Error;
                this.logger.debug(`Error processing message: ${err.message}`);
              }
            })();
          }
        },
      );

      // Wallet queue consumer
      await channel.consume(
        this.walletQueueName,
        (msg: amqp.ConsumeMessage | null): void => {
          if (msg) {
            void (async () => {
              try {
                const payload = JSON.parse(msg.content.toString()) as {
                  userId: number;
                  currency: string;
                  balance: number;
                  type: string;
                };
                this.logger.log(`Wallet message received: ${JSON.stringify(payload)}`);
                if (payload.type === 'WALLET_CREATE') {
                  const wallet = new Wallet();
                  wallet.userId = payload.userId;
                  wallet.currency = payload.currency;
                  wallet.balance = payload.balance;
                  wallet.status = 'ACTIVE';
                  await this.walletRepository.saveWallet(wallet);
                  this.logger.log(`Wallet created for user ID: ${payload.userId}`);
                }
                channel.ack(msg);
              } catch (error) {
                const err = error as Error;
                this.logger.debug(`Error processing wallet message: ${err.message}`);
                channel.nack(msg, false, false);
              }
            })();
          }
        },
      );

      this.logger.log(`Listening to RabbitMQ queues: ${this.queueName}, ${this.walletQueueName}`);
    } catch (error) {
      const err = error as Error;
      this.logger.fatal(`RabbitMQ listener failed to start: ${err.message}`);
    }
  }
}
