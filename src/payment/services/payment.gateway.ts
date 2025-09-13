/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentInitResponse } from 'src/dtos/payment-init-response.dto';
import { PaymentRequestDto } from 'src/dtos/payment-request.dto';
import { PaymentVerifyResponse } from 'src/dtos/payment-verify-response.dto';
import { AxiosConfig } from 'src/config/axios.config';
import { CustomLogger } from 'src/log/logs.service';
import { AxiosError } from 'axios';

@Injectable()
export class PaymentGatewayService {
  private readonly secretKey: string;

  constructor(
    private readonly logger: CustomLogger,
    private readonly axiosConfig: AxiosConfig,
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

      const { authorization_url, access_code, reference } = response.data.data;
      return { authorization_url, access_code, reference };
    } catch (err: unknown) {
      const error = err as AxiosError;
      this.logger.error(
        'Payment initialization failed',
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message,
      );
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
}
