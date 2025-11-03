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

  async listenOTP(channel: Channel, queueName: string): Promise<void> {
    this.logger.log(`Listening to RabbitMQ queue: ${queueName}`);

    await channel.consume(
      queueName,
      (msg: amqp.ConsumeMessage | null): void => {
        if (msg) {
          const maxRetries = 5;

          const retry = async (retryCount = 0): Promise<void> => {
            try {
              const payload = JSON.parse(msg.content.toString()) as {
                to: string;
                otp: string;
                subject: string;
                type: string;
              };

              this.logger.log(`Message received: ${JSON.stringify(payload)}`);

              if (payload.type === 'EMAIL_VERIFICATION') {
                const status = await this.emailService.sendOTPEmail(payload);
                if (status) {
                  this.logger.log(`Email sent successfully to ${payload.to}`);
                  channel.ack(msg);
                } else {
                  throw new Error('Email sending failed');
                }
              } else {
                this.logger.warn(`Unknown message type: ${payload.type}`);
                channel.ack(msg);
              }
            } catch (error) {
              this.logger.warn(
                `Retry ${retryCount + 1}/${maxRetries} - ${(error as Error).message}`,
              );

              if (retryCount < maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000;
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                setTimeout(() => retry(retryCount + 1), delay);
              } else {
                this.logger.debug(
                  `Max retries reached. Discarding message: ${msg.content.toString()}`,
                );
                channel.ack(msg); // Optionally reject instead: `channel.nack(msg, false, false);`
              }
            }
          };

          void retry();
        }
      },
    );
  }

  async listenWalletCreation(channel: Channel, walletQueueName: string) {
    this.logger.log(`Listening to RabbitMQ queue: ${walletQueueName}`);

    await channel.consume(
      walletQueueName,
      (msg: amqp.ConsumeMessage | null): void => {
        if (msg) {
          const retry = async () => {
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
                // generate wallet

                let accountNumber: string = '0';
                let isUnique = false;

                while (!isUnique) {
                  accountNumber = Math.floor(
                    1000000000 + Math.random() * 9000000000,
                  ).toString();
                  const existingWallet =
                    await this.walletRepository.findByWalletAccount(
                      accountNumber,
                    );
                  if (!existingWallet) {
                    isUnique = true;
                  }
                }

                wallet.accountNumber = accountNumber;

                await this.walletRepository.saveWallet(wallet);
                this.logger.log(
                  `Wallet created for user ID: ${payload.userId}`,
                );
                channel.ack(msg);
              } else {
                this.logger.warn(`Unknown message type: ${payload.type}`);
                channel.ack(msg); // Acknowledge to discard unknown type
              }
            } catch (error) {
              this.logger.debug(
                `Error processing wallet message: ${(error as Error).message}`,
              );
              setTimeout(() => {
                retry().catch((err) =>
                  this.logger.debug(`Retry failed: ${(err as Error).message}`),
                );
              }, 3000);
            }
          };

          void retry();
        }
      },
    );
  }
}
