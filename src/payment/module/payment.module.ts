import { Module } from '@nestjs/common';
import { PaymentGatewayService } from '../services/payment.gateway';
import { CustomLogger } from 'src/log/logs.service';
import { AxiosConfig } from 'src/config/axios.config';
@Module({
  imports: [],

  providers: [PaymentGatewayService, AxiosConfig, CustomLogger],
})
export class PaymentModule {}
