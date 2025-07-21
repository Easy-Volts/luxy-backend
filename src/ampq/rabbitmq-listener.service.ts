import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { CustomLogger } from 'src/log/logs.service';
import { ListenerServiceImpl } from './service/ampq.serviceImpl';

@Injectable()
export class RabbitMQListenerService implements OnModuleInit {
  private readonly queueName = 'otp-queue';
  private readonly url = 'amqp://guest:guest@localhost';
  private readonly walletQueueName = 'wallet-queue';

  constructor(
    private readonly logger: CustomLogger,
    private readonly listenerService: ListenerServiceImpl,
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
      await this.listenerService.listenOTP(channel, this.queueName);
      // Wallet queue consumer
      await this.listenerService.listenWalletCreation(channel, this.queueName);
    } catch (error) {
      const err = error as Error;
      this.logger.fatal(`RabbitMQ listener failed to start: ${err.message}`);
    }
  }
}
