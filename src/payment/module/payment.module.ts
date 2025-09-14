import { Module } from '@nestjs/common';
import { PaymentGatewayService } from '../services/payment.gateway';
import { CustomLogger } from 'src/log/logs.service';
import { AxiosConfig } from 'src/config/axios.config';
import { TransactionRepository } from 'src/domain/repository/transaction.repository';
import { Transaction } from 'src/domain/entities/transaction.model';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],

  providers: [
    PaymentGatewayService,
    // TransactionRepository,

    AxiosConfig,
    CustomLogger,
    TransactionRepository,
  ],
  exports: [TransactionRepository],
})
export class PaymentModule {}
