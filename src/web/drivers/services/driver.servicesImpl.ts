// import { Injectable } from '@nestjs/common';
// import { DriverService } from '../interfaces/driver.service';
// import { DriverRepository } from 'src/domain/repository/driver.repository';
// import { CustomLogger } from 'src/log/logs.service';

// @Injectable()
// export class DriverServiceImpl implements DriverService {
//   constructor(
//     private readonly driverRepository: DriverRepository,
//     private readonly logger: CustomLogger,
//   ) {
//     this.logger.setContext(DriverServiceImpl.name);
//   }

//   async deleteDriver(driverId: number): Promise<void> {
//     const driver = await this.driverRepository.findOneById(driverId);
//     if (!driver) {
//       throw new Error(`Driver with ID ${driverId} not found.`);
//     }
//     await this.driverRepository.remove(driver);
//   }
// }
