import { EmailService } from './email.service';
import { CustomLogger } from 'src/log/logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/domain/entities/wallet.model';
import { Module } from '@nestjs/common';
import { AMPQModule } from 'src/ampq/module/ampq/ampq.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), AMPQModule],
  providers: [EmailService, CustomLogger],
})
export class NotificationModule {}
