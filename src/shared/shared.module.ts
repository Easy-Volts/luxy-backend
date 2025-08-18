import { Module } from '@nestjs/common';
import { CustomLogger } from 'src/log/logs.service';
import { EmailService } from 'src/email-notification/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/domain/entities/user.model';
import { Customer } from 'src/domain/entities/customer.model';
import { Wallet } from 'src/domain/entities/wallet.model';
import { Car } from 'src/domain/entities/car.model';
import { Brand } from 'src/domain/entities/brand.model';
import { Vendor } from 'src/domain/entities/vendor.model';
import { CarLending } from 'src/domain/entities/car.lending.model';
import { UserRepository } from 'src/domain/repository/user.repository';
import { CustomerRepository } from 'src/domain/repository/customer.repository';
import { NotificationRepository } from 'src/domain/repository/notification.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Customer,
      Wallet,
      Car,
      Brand,
      Vendor,
      CarLending,
      NotificationRepository,
    ]),
  ],
  providers: [CustomLogger, EmailService, UserRepository, CustomerRepository],
  exports: [
    CustomLogger,
    EmailService,
    TypeOrmModule,
    UserRepository,
    CustomerRepository,
  ],
})
export class SharedModule {}
