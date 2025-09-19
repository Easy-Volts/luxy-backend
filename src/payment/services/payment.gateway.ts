/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentInitResponse } from 'src/dtos/payment-init-response.dto';
import { PaymentRequestDto } from 'src/dtos/payment-request.dto';
import { PaymentVerifyResponse } from 'src/dtos/payment-verify-response.dto';
import { FundWalletRequestDto } from 'src/dtos/fund-wallet-request.dto';
import { FundWalletInitResponse, FundWalletVerifyResponse } from 'src/dtos/fund-wallet-response.dto';
import { AxiosConfig } from 'src/config/axios.config';
import { CustomLogger } from 'src/log/logs.service';
import { AxiosError } from 'axios';
import { Transaction } from 'src/domain/entities/transaction.model';
import { PaymentMethod } from 'src/enums/user.enum';
import { TransactionRepository } from 'src/domain/repository/transaction.repository';

@Injectable()
export class PaymentGatewayService {
  private readonly secretKey: string;

  constructor(
    private readonly logger: CustomLogger,
    private readonly axiosConfig: AxiosConfig,
    private readonly transactionRepository: TransactionRepository,
  ) {
    this.logger.setContext(PaymentGatewayService.name);
    this.secretKey = process.env.PAYSTACK_SECRET_KEY ?? '';
  }

  async processPayment(data: PaymentRequestDto): Promise<PaymentInitResponse> {
    try {
      this.logger.log(
        `Initializing payment for ${data.email}, amount: ${data.amount}`,
      );
      const response = await this.axiosConfig.getHttpClient().post(
        '/transaction/initialize',
        {
          amount: data.amount * 100,
          email: data.email,
          currency: data.currency || 'NGN',
          metadata: {
            username: data.username,
            source: data.source,
          },
        },
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        },
      );
      this.logger.log('Payment:: Code ' + JSON.stringify(response.data.data));

      const { authorization_url, access_code, reference } = response.data.data;
      const transaction = new Transaction();
      transaction.amount = data.amount;
      transaction.userId = data.userId;
      transaction.dateCreated = new Date();
      transaction.paymentType = PaymentMethod.BANK_TRANSFER;
      transaction.status = 'PENDING';
      transaction.reefrence = reference;
      transaction.code = data.source!;
      await this.transactionRepository.savetransaction(transaction);

      return { authorization_url, access_code, reference };
    } catch (err: unknown) {
      const error = err as AxiosError;
      this.logger.error(
        'Payment initialization failed',
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message,
      );
      const transaction = new Transaction();
      transaction.amount = data.amount;
      transaction.userId = data.userId;
      transaction.dateCreated = new Date();
      transaction.paymentType = PaymentMethod.BANK_TRANSFER;
      transaction.status = 'FAILED';
      transaction.reefrence = undefined;
      transaction.code = data.source!;
      await this.transactionRepository.savetransaction(transaction);
      throw new HttpException(
        'Unable to initialize payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerifyResponse> {
    try {
      const response = await this.axiosConfig
        .getHttpClient()
        .get(`/transaction/verify/${reference}`, {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        });

      const data = response.data.data as PaymentVerifyResponse;
      return {
        status: data.status,
        reference: data.reference,
        amount: data.amount / 100,
        paidAt: new Date(data.paidAt),
        channel: data.channel,
        currency: data.currency,
        customer: {
          email: data.customer.email,
          username: data.customer?.username,
        },
      };
    } catch (err: unknown) {
      const error = err as AxiosError;
      this.logger.error(
        `Payment verification failed for ${reference}`,
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message,
      );
      throw new HttpException(
        'Unable to verify payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    try {
      const response = await this.axiosConfig.getHttpClient().post(
        '/refund',
        {
          transaction: transactionId,
          amount: amount * 100,
        },
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        },
      );

      return response.data.status === true;
    } catch (err: unknown) {
      const error = err as AxiosError;
      this.logger.error(
        `Refund failed for transaction ${transactionId}`,
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message,
      );
      throw new HttpException(
        'Unable to process refund',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async initiateFundWallet(data: FundWalletRequestDto, userId: number): Promise<FundWalletInitResponse> {
    try {
      this.logger.log(
        `Initializing wallet funding for ${data.email}, amount: ${data.amount}`,
      );
      
      const response = await this.axiosConfig.getHttpClient().post(
        '/transaction/initialize',
        {
          amount: data.amount * 100, // Convert to kobo
          email: data.email,
          currency: data.currency || 'NGN',
          callback_url: data.callback_url,
          metadata: {
            ...data.metadata,
            transaction_type: 'wallet_funding',
            user_id: userId,
          },
        },
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        },
      );

      this.logger.log('Wallet Funding Initialization:: ' + JSON.stringify(response.data.data));

      const { authorization_url, access_code, reference } = response.data.data;
      
      // Create transaction record
      const transaction = new Transaction();
      transaction.amount = data.amount;
      transaction.userId = userId;
      transaction.dateCreated = new Date();
      transaction.paymentType = PaymentMethod.BANK_TRANSFER;
      transaction.status = 'PENDING';
      transaction.reefrence = reference;
      transaction.code = 'WALLET_FUNDING';
      await this.transactionRepository.savetransaction(transaction);

      return { authorization_url, access_code, reference };
    } catch (err: unknown) {
      const error = err as AxiosError;
      this.logger.error(
        'Wallet funding initialization failed',
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message,
      );
      
      // Create failed transaction record
      const transaction = new Transaction();
      transaction.amount = data.amount;
      transaction.userId = userId;
      transaction.dateCreated = new Date();
      transaction.paymentType = PaymentMethod.BANK_TRANSFER;
      transaction.status = 'FAILED';
      transaction.reefrence = undefined;
      transaction.code = 'WALLET_FUNDING';
      await this.transactionRepository.savetransaction(transaction);
      
      throw new HttpException(
        'Unable to initialize wallet funding',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyFundWallet(reference: string): Promise<FundWalletVerifyResponse> {
    try {
      const response = await this.axiosConfig
        .getHttpClient()
        .get(`/transaction/verify/${reference}`, {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        });

      const data = response.data.data as FundWalletVerifyResponse;
      return {
        status: data.status,
        reference: data.reference,
        amount: data.amount / 100, // Convert from kobo
        paidAt: new Date(data.paidAt),
        channel: data.channel,
        currency: data.currency,
        transaction_id: data.transaction_id,
        customer: {
          email: data.customer.email,
          customer_code: data.customer?.customer_code,
        },
      };
    } catch (err: unknown) {
      const error = err as AxiosError;
      this.logger.error(
        `Wallet funding verification failed for ${reference}`,
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message,
      );
      throw new HttpException(
        'Unable to verify wallet funding',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
