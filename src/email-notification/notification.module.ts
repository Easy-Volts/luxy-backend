import { RabbitMQListenerService } from 'src/ampq/rabbitmq-listener.service';
import { EmailService } from './email.service';
import { CustomLogger } from 'src/log/logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/domain/entities/wallet.model';
import { WalletRepository } from 'src/domain/repository/wallet.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [RabbitMQListenerService, EmailService, CustomLogger, WalletRepository],
})
export class NotificationModule {}
