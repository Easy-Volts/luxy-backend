import { Module } from '@nestjs/common';
import { BookingController } from '../controllers/booking.controller';
import { BOOKING_SERVICE } from '../interface/booking.service';
import { BookingServiceImpl } from '../services/booking.serviceImpl';
import { CarLendingRepository } from 'src/domain/repository/car.booking.repository';
import { CarRepository } from 'src/domain/repository/car.repository';
import { CustomerRepository } from 'src/domain/repository/customer.repository';
import { DriverRepository } from 'src/domain/repository/driver.repository';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { AuthGuard } from 'src/commons/security/guard';
import { PaymentModule } from 'src/payment/module/payment.module';
import { PaymentGatewayService } from 'src/payment/services/payment.gateway';
import { AxiosConfig } from 'src/config/axios.config';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [PaymentModule, SharedModule],
  controllers: [BookingController],
  providers: [
    {
      provide: BOOKING_SERVICE,
      useClass: BookingServiceImpl,
    },
    CarLendingRepository,
    CarRepository,
    CustomerRepository,
    DriverRepository,
    PaymentGatewayService,
    AxiosConfig,
    RolesGuard,
    AuthGuard,
  ],
})
export class BookingModule {}
