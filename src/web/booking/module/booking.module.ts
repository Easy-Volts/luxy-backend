import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from '../controllers/booking.controller';
import { BOOKING_SERVICE } from '../interface/booking.service';
import { BookingServiceImpl } from '../services/booking.serviceImpl';
import { CarLending } from 'src/domain/entities/car.lending.model';
import { Car } from 'src/domain/entities/car.model';
import { Customer } from 'src/domain/entities/customer.model';
import { Brand } from 'src/domain/entities/brand.model';
import { Vendor } from 'src/domain/entities/vendor.model';
import { CarLendingRepository } from 'src/domain/repository/car.booking.repository';
import { CarRepository } from 'src/domain/repository/car.repository';
import { CustomerRepository } from 'src/domain/repository/customer.repository';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { AuthGuard } from 'src/commons/security/guard';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarLending, Car, Customer, Brand, Vendor]),
    SharedModule,
  ],
  controllers: [BookingController],
  providers: [
    {
      provide: BOOKING_SERVICE,
      useClass: BookingServiceImpl,
    },
    CarLendingRepository,
    CarRepository,
    CustomerRepository,
    RolesGuard,
    AuthGuard,
  ],
  exports: [BOOKING_SERVICE, CarLendingRepository],
})
export class BookingModule {}
