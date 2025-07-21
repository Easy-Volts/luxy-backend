import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/log/logs.service';
import { EmailService } from 'src/email-notification/email.service';
import * as amqp from 'amqplib';
import { Channel } from 'amqplib';
import { Wallet } from 'src/domain/entities/wallet.model';
import { WalletRepository } from 'src/domain/repository/wallet.repository';

@Injectable()
export class ListenerServiceImpl {
  constructor(
    private readonly logger: CustomLogger,
    private readonly walletRepository: WalletRepository,
    private readonly emailService: EmailService,
  ) {
    this.logger.setContext(ListenerServiceImpl.name);
  }

  async listenOTP(channel: Channel, queueName: string) {
    this.logger.log(`Listening to RabbitMQ queues:  ${queueName}`);

    await channel.consume(
      queueName,
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
  }

  async listenWalletCreation(channel: Channel, walletQueueName: string) {
    // Wallet queue consumer
    this.logger.log(`Listening to RabbitMQ queues:  ${walletQueueName}`);
    await channel.consume(
      walletQueueName,
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
              this.logger.log(
                `Wallet message received: ${JSON.stringify(payload)}`,
              );
              if (payload.type === 'WALLET_CREATE') {
                const wallet = new Wallet();
                wallet.userId = payload.userId;
                wallet.currency = payload.currency;
                wallet.balance = payload.balance;
                wallet.status = 'ACTIVE';
                await this.walletRepository.saveWallet(wallet);
                this.logger.log(
                  `Wallet created for user ID: ${payload.userId}`,
                );
              }
              channel.ack(msg);
            } catch (error) {
              const err = error as Error;
              this.logger.debug(
                `Error processing wallet message: ${err.message}`,
              );
              channel.nack(msg, false, false);
            }
          })();
        }
      },
    );
  }
}
