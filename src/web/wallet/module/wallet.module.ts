import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from '../controllers/wallet.controller';
import { WalletService } from '../services/wallet.service';
import { WalletRepository } from 'src/domain/repository/wallet.repository';
import { TransactionRepository } from 'src/domain/repository/transaction.repository';
import { PaymentGatewayService } from 'src/payment/services/payment.gateway';
import { Wallet } from 'src/domain/entities/wallet.model';
import { Transaction } from 'src/domain/entities/transaction.model';
import { AxiosConfig } from 'src/config/axios.config';
import { CustomLogger } from 'src/log/logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [WalletController],
  providers: [
    WalletService,
    WalletRepository,
    TransactionRepository,
    PaymentGatewayService,
    AxiosConfig,
    CustomLogger,
  ],
  exports: [WalletService, WalletRepository],
})
export class WalletModule {}