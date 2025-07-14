import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { EmailService } from 'src/email-notification/email.service';
import { CustomLogger } from 'src/log/logs.service';

@Injectable()
export class RabbitMQListenerService implements OnModuleInit {
  private readonly queueName = 'otp-queue';
  private readonly url = 'amqp://guest:guest@localhost';

  constructor(
    private readonly logger: CustomLogger,
    private readonly emailService: EmailService,
  ) {
    this.logger.setContext(RabbitMQListenerService.name);
  }

  async onModuleInit(): Promise<void> {
    try {
      const connection = await amqp.connect(this.url);
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queueName);

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

      this.logger.log(`Listening to RabbitMQ queue: ${this.queueName}`);
    } catch (error) {
      const err = error as Error;
      this.logger.fatal(`RabbitMQ listener failed to start: ${err.message}`);
    }
  }
}
