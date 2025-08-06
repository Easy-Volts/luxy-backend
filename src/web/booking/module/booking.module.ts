import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { BookingController } from '../controllers/booking.controller';
import { BookingServiceImpl } from '../services/booking.serviceImpl';
import { BOOKING_SERVICE } from '../interface/booking.service';
import { Booking } from '../../../domain/entities/booking.model';
import { Car } from '../../../domain/entities/car.model';
import { Customer } from '../../../domain/entities/customer.model';
import { Users } from '../../../domain/entities/user.model';
import { BookingRepository } from '../../../domain/repository/booking.repository';
import { CustomerRepository } from '../../../domain/repository/customer.repository';
import { SharedModule } from '../../../shared/shared.module';
import { AuthGuard } from '../../../commons/security/guard';
import { RolesGuard } from '../../../commons/security/roles.guard';
import * as dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET ?? 'defaultSecret';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Car, Customer, Users]),
    JwtModule.register({
      secret: secret,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    SharedModule,
  ],
  controllers: [BookingController],
  providers: [
    BookingRepository,
    CustomerRepository,
    AuthGuard,
    RolesGuard,
    {
      provide: BOOKING_SERVICE,
      useClass: BookingServiceImpl,
    },
  ],
  exports: [BOOKING_SERVICE, BookingRepository],
})
export class BookingModule {}
