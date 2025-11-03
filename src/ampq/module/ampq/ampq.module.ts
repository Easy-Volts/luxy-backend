import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLogger } from 'src/log/logs.service';
import { RabbitMQService } from 'src/ampq/service/rabbitMQ';
import { EmailService } from 'src/email-notification/email.service';
import { Wallet } from 'src/domain/entities/wallet.model';
import { WalletRepository } from 'src/domain/repository/wallet.repository';
import { ListenerServiceImpl } from 'src/ampq/service/ampq.serviceImpl';
import { RabbitMQListenerService } from 'src/ampq/rabbitmq-listener.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],

  providers: [
    ListenerServiceImpl,
    CustomLogger,
    WalletRepository,
    RabbitMQService,
    RabbitMQListenerService,
    EmailService,
  ],
})
export class AMPQModule {}
