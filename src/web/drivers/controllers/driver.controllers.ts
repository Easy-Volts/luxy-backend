import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authenticated } from 'src/commons/decorator/auth.decorator';
import { CurrentUser } from 'src/commons/decorator/current-user.decorator';
import { Roles } from 'src/commons/decorator/roles.decorator';
import { AccountStatusGuard } from 'src/commons/security/account-status.guard';
import { AuthGuard } from 'src/commons/security/guard';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { BookingResponseDto } from 'src/dtos/booking.dto';
import { ApiResponses } from 'src/dtos/response';
import { UserType } from 'src/enums/user.enum';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';
import { DRIVER_SERVICE, DriverService } from '../interfaces/driver.service';

@ApiTags('Driver Management')
@Controller('api/v1/drivers')
@UseGuards(AuthGuard, RolesGuard, AccountStatusGuard)
@Authenticated()
@Roles(UserType.DRIVER, UserType.ADMIN)
export class DriverController {
  constructor(
    @Inject(DRIVER_SERVICE)
    private readonly driverService: DriverService,
  ) {}

  @Get('bookings')
  @Roles(UserType.DRIVER, UserType.ADMIN)
  @ApiOperation({
    summary: 'Get list of driver bookings with pagination and status filter',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description:
      'Filter by booking status (PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED, REJECTED)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Driver bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  async getDriverBookings(
    @CurrentUser() currentUser: UserDetails,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<ApiResponses<BookingResponseDto[]>> {
    return this.driverService.getDriverBookings(currentUser, {
      status,
      page,
      limit,
    });
  }

  @Delete(':id')
  async deleteDriver(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.driverService.deleteDriver(id);
  }
}
