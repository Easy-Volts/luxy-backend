import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from '../controllers/driver.controllers';
import { DriverServiceImpl } from '../services/driver.servicesImpl';
import { DRIVER_SERVICE } from '../interfaces/driver.service';
import { DriverRepository } from '../../../domain/repository/driver.repository';
import { SharedModule } from '../../../shared/shared.module';
import { Driver } from 'src/domain/entities/driver.model';

@Module({
  imports: [TypeOrmModule.forFeature([Driver]), SharedModule],
  controllers: [DriverController],
  providers: [
    {
      provide: DRIVER_SERVICE,
      useClass: DriverServiceImpl,
    },
    DriverRepository,
  ],
  exports: [DRIVER_SERVICE, DriverRepository],
})
export class DriverModule {}
