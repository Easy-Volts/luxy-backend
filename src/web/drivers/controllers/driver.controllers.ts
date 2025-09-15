// import {
//   Controller,
//   Delete,
//   Inject,
//   Param,
//   ParseIntPipe,
//   UseGuards,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { ApiTags } from '@nestjs/swagger';
// import { Authenticated } from 'src/commons/decorator/auth.decorator';
// import { Roles } from 'src/commons/decorator/roles.decorator';
// import { AccountStatusGuard } from 'src/commons/security/account-status.guard';
// import { RolesGuard } from 'src/commons/security/roles.guard';
// import { UserType } from 'src/enums/user.enum';
// import { DRIVER_SERVICE, DriverService } from '../interfaces/driver.service';

// @ApiTags('Driver Management')
// @Controller('driver')
// @UseGuards(AuthGuard, RolesGuard, AccountStatusGuard)
// @Authenticated()
// @Roles(UserType.DRIVER, UserType.ADMIN)
// export class DriverController {
//   constructor(
//     @Inject(DRIVER_SERVICE)
//     private readonly driverService: DriverService,
//   ) {}

//   @Delete(':id')
//   async deleteDriver(@Param('id', ParseIntPipe) id: number): Promise<void> {
//     return this.driverService.deleteDriver(id);
//   }
// }
