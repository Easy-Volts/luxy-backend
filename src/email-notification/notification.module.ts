import { RabbitMQListenerService } from 'src/ampq/rabbitmq-listener.service';
import { EmailService } from './email.service';
import { CustomLogger } from 'src/log/logs.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [RabbitMQListenerService, EmailService, CustomLogger],
})
export class NotificationModule {}
