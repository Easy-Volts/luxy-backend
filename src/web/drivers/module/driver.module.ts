// // src/modules/driver/driver.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { DriverController } from '../controllers/driver.controllers';
// import { DriverServiceImpl } from '../services/driver.servicesImpl';
// import { DRIVER_SERVICE } from '../interfaces/driver.service';
// import { Driver } from 'src/domain/entities/driver.model';
// import { DriverRepository } from 'src/domain/repository/driver.repository';
// import { CustomLogger } from 'src/log/logs.service';

// @Module({
//   imports: [TypeOrmModule.forFeature([Driver])],
//   controllers: [DriverController],
//   providers: [
//     {
//       provide: DRIVER_SERVICE,
//       useClass: DriverServiceImpl,
//     },
//     DriverRepository,
//     CustomLogger,
//   ],
//   exports: [DRIVER_SERVICE, DriverRepository],
// })
// export class DriverModule {}
