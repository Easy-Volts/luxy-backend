// src/web/users/users.module.ts
import { Module } from '@nestjs/common';
import { CAR_SERVICE } from '../interface/car.service'; // adjust path if needed
import { CarServiceImpl } from '../services/car.serviceImpl';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { AuthGuard } from 'src/commons/security/guard';
import { SharedModule } from 'src/shared/shared.module';
import { CarController } from '../controllers/cars.controller';
import { CarRepository } from 'src/domain/repository/car.repository';

@Module({
  imports: [SharedModule],
  controllers: [CarController],
  providers: [
    {
      provide: CAR_SERVICE,
      useClass: CarServiceImpl,
    },
    CarRepository,
    RolesGuard,
    AuthGuard,
  ],
})
export class CarModule {}
