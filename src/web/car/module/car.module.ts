import { Module } from '@nestjs/common';
import { CarController } from '../controllers/car.controller';
import { CarRepository } from 'src/domain/repository/car.repository';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { AuthGuard } from 'src/commons/security/guard';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [CarController],
  providers: [
    CarRepository,
    RolesGuard,
    AuthGuard,
  ],
  exports: [CarRepository],
})
export class CarModule {}
