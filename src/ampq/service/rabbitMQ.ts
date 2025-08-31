import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { CustomLogger } from 'src/log/logs.service';

@Injectable()
export class RabbitMQService {
  private readonly url: string;

  private readonly logger: CustomLogger;

  constructor(logger: CustomLogger) {
    this.url = 'amqp://guest:guest@localhost';
    this.logger = logger;
    this.logger.setContext(RabbitMQService.name);
  }

  async sendMessageOTP(data: {
    data: {
      to: string;
      otp: string;
      subject: string;
      type: string;
    };
    queue: string;
  }) {
    const queueName = data.queue;
    const message = data.data;

    try {
      const connection = await amqp.connect(this.url);
      const channel = await connection.createChannel();

      await channel.assertQueue(queueName);

      const messageBuffer = Buffer.from(JSON.stringify(message));
      channel.sendToQueue(queueName, messageBuffer);

      this.logger.log(
        `Message sent to RabbitMQ queue: ${JSON.stringify(message)}`,
      );

      await channel.close();
      await connection.close();
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.warn(`Error sending message to RabbitMQ: ${err.message}`);
    }
  }

  async sendMessageWallet(message: any, queueName: string) {
    try {
      const connection = await amqp.connect(this.url);
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName);
      const messageBuffer = Buffer.from(JSON.stringify(message));
      channel.sendToQueue(queueName, messageBuffer);
      this.logger.log(
        `Wallet message sent to RabbitMQ queue: ${JSON.stringify(message)}`,
      );
      await channel.close();
      await connection.close();
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.warn(
        `Error sending wallet message to RabbitMQ: ${err.message}`,
      );
    }
  }
}
