import {
  Controller,
  Get,
  Inject,
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
import { ReviewResponseDto, ReviewStatsDto } from 'src/dtos/review.dto';
import { DriverDetailsResponseDto } from 'src/dtos/driver.details.dto';
import { DriverQueryDto } from 'src/dtos/driver.query.dto';
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

  @Get()
  @Roles(UserType.ADMIN)
  @ApiOperation({
    summary: 'Get all drivers with pagination and filtering (Admin only)',
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
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by driver status (ACTIVE, INACTIVE, SUSPENDED)',
    example: 'ACTIVE',
  })
  @ApiQuery({
    name: 'kycVerified',
    required: false,
    description: 'Filter by KYC verification status',
    example: true,
  })
  @ApiQuery({
    name: 'city',
    required: false,
    description: 'Filter by city',
    example: 'Lagos',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    description: 'Filter by country',
    example: 'Nigeria',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name or email',
    example: 'Jenny',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort field (name, dateCreated, rating)',
    example: 'dateCreated',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (ASC, DESC)',
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'Drivers retrieved successfully with pagination',
    type: [DriverDetailsResponseDto],
  })
  async getAllDrivers(
    @Query() queryDto: DriverQueryDto,
  ): Promise<ApiResponses<DriverDetailsResponseDto[]>> {
    return this.driverService.getAllDrivers(queryDto);
  }

  @Get('profile')
  @Roles(UserType.DRIVER, UserType.ADMIN)
  @ApiOperation({
    summary: 'Get driver profile details including stats, contact info, and car details',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver details retrieved successfully',
    type: DriverDetailsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Driver profile not found',
  })
  async getDriverDetails(
    @CurrentUser() currentUser: UserDetails,
  ): Promise<ApiResponses<DriverDetailsResponseDto>> {
    return this.driverService.getDriverDetails(currentUser);
  }

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

  @Get('ratings')
  @Roles(UserType.DRIVER, UserType.ADMIN)
  @ApiOperation({
    summary: 'Get all ratings/reviews for the driver',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver ratings retrieved successfully',
    type: [ReviewResponseDto],
  })
  async getDriverRatings(
    @CurrentUser() currentUser: UserDetails,
  ): Promise<ApiResponses<ReviewResponseDto[]>> {
    return this.driverService.getDriverRatings(currentUser);
  }

  @Get('ratings/stats')
  @Roles(UserType.DRIVER, UserType.ADMIN)
  @ApiOperation({
    summary: 'Get rating statistics for the driver',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver rating statistics retrieved successfully',
    type: ReviewStatsDto,
  })
  async getDriverRatingStats(
    @CurrentUser() currentUser: UserDetails,
  ): Promise<ApiResponses<ReviewStatsDto>> {
    return this.driverService.getDriverRatingStats(currentUser);
  }
}
