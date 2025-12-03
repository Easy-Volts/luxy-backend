// src/modules/driver/driver.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from '../controllers/driver.controllers';
import { DriverServiceImpl } from '../services/driver.servicesImpl';
import { DRIVER_SERVICE } from '../interfaces/driver.service';
import { Driver } from 'src/domain/entities/driver.model';
import { DriverRepository } from 'src/domain/repository/driver.repository';
import { UserRepository } from 'src/domain/repository/user.repository';
import { CarRepository } from 'src/domain/repository/car.repository';
import { CustomLogger } from 'src/log/logs.service';
import { CarLendingRepository } from 'src/domain/repository/car.booking.repository';
import { CarLending } from 'src/domain/entities/car.lending.model';
import { ReviewRepository } from 'src/domain/repository/review.repository';
import { Review } from 'src/domain/entities/review.model';
import { Users } from 'src/domain/entities/user.model';
import { Car } from 'src/domain/entities/car.model';
import { SharedModule } from 'src/shared/shared.module';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { AuthGuard } from 'src/commons/security/guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver, CarLending, Review, Users, Car]),
    SharedModule,
  ],
  controllers: [DriverController],
  providers: [
    {
      provide: DRIVER_SERVICE,
      useClass: DriverServiceImpl,
    },
    DriverRepository,
    UserRepository,
    CarRepository,
    CarLendingRepository,
    ReviewRepository,
    CustomLogger,
    RolesGuard,
    AuthGuard,
  ],
  exports: [DRIVER_SERVICE, DriverRepository],
})
export class DriverModule {}
