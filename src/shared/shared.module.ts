import { Module } from '@nestjs/common';
import { CustomLogger } from 'src/log/logs.service';
import { EmailService } from 'src/email-notification/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/domain/entities/user.model';
import { Customer } from 'src/domain/entities/customer.model';
import { Wallet } from 'src/domain/entities/wallet.model';
import { UserRepository } from 'src/domain/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Customer, Wallet])],
  providers: [CustomLogger, EmailService, UserRepository],
  exports: [CustomLogger, EmailService, TypeOrmModule, UserRepository],
})
export class SharedModule {}
