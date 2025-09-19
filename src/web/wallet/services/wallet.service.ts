import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { WalletRepository } from 'src/domain/repository/wallet.repository';
import { TransactionRepository } from 'src/domain/repository/transaction.repository';
import { PaymentGatewayService } from 'src/payment/services/payment.gateway';
import { FundWalletRequestDto } from 'src/dtos/fund-wallet-request.dto';
import { FundWalletInitResponse, WalletFundingResponse } from 'src/dtos/fund-wallet-response.dto';
import { CustomLogger } from 'src/log/logs.service';
import { Transaction } from 'src/domain/entities/transaction.model';
import { PaymentMethod } from 'src/enums/user.enum';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(WalletService.name);
  }

  async initiateFundWallet(
    fundWalletDto: FundWalletRequestDto,
    userId: number,
  ): Promise<FundWalletInitResponse> {
    try {
      // Ensure wallet exists
      await this.walletRepository.createWalletIfNotExists(userId);

      // Validate amount
      const minAmount = Number(process.env.PAYSTACK_MIN_AMOUNT) || 100;
      const maxAmount = Number(process.env.PAYSTACK_MAX_AMOUNT) || 1000000;

      if (fundWalletDto.amount < minAmount) {
        throw new HttpException(
          `Minimum funding amount is ₦${minAmount}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (fundWalletDto.amount > maxAmount) {
        throw new HttpException(
          `Maximum funding amount is ₦${maxAmount}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Initialize payment with Paystack
      return await this.paymentGatewayService.initiateFundWallet(
        fundWalletDto,
        userId,
      );
    } catch (error) {
      this.logger.error(
        `Failed to initiate wallet funding for user ${userId}`,
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }

  async verifyAndProcessFundWallet(reference: string): Promise<WalletFundingResponse> {
    try {
      // Verify payment with Paystack
      const verification = await this.paymentGatewayService.verifyFundWallet(reference);

      if (verification.status !== 'success') {
        throw new HttpException(
          'Payment verification failed',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Find the transaction
      const transaction = await this.transactionRepository.findByReference(reference);
      if (!transaction) {
        throw new HttpException(
          'Transaction not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Check if already processed
      if (transaction.status === 'PAID') {
        const wallet = await this.walletRepository.findByUserId(transaction.userId);
        return {
          success: true,
          message: 'Wallet funding already processed',
          data: {
            wallet_balance: wallet ? Number(wallet.balance) : 0,
            transaction_reference: reference,
            amount_funded: verification.amount,
          },
        };
      }

      // Update wallet balance
      const wallet = await this.walletRepository.updateWalletBalance(
        transaction.userId,
        verification.amount,
      );

      if (!wallet) {
        throw new HttpException(
          'Failed to update wallet balance',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Update transaction status
      transaction.status = 'PAID';
      transaction.lastUpdated = new Date();
      await this.transactionRepository.savetransaction(transaction);

      this.logger.log(
        `Wallet funded successfully. User: ${transaction.userId}, Amount: ${verification.amount}, New Balance: ${wallet.balance}`,
      );

      return {
        success: true,
        message: 'Wallet funded successfully',
        data: {
          wallet_balance: Number(wallet.balance),
          transaction_reference: reference,
          amount_funded: verification.amount,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to process wallet funding for reference ${reference}`,
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }

  async getWalletBalance(userId: number): Promise<number> {
    try {
      await this.walletRepository.createWalletIfNotExists(userId);
      return await this.walletRepository.getWalletBalance(userId);
    } catch (error) {
      this.logger.error(
        `Failed to get wallet balance for user ${userId}`,
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new HttpException(
        'Failed to retrieve wallet balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWalletDetails(userId: number) {
    try {
      const wallet = await this.walletRepository.createWalletIfNotExists(userId);
      return {
        id: wallet.id,
        userId: wallet.userId,
        balance: Number(wallet.balance),
        currency: wallet.currency,
        status: wallet.status,
        accountNumber: wallet.accountNumber,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get wallet details for user ${userId}`,
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new HttpException(
        'Failed to retrieve wallet details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}