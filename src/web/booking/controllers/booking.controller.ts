import {
  Controller,
  Post,
  Get,
  Body,
  Inject,
  UseGuards,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { BOOKING_SERVICE, BookingService } from '../interface/booking.service';
import {
  CreateBookingDto,
  BookingResponseDto,
  AcceptRideDto,
  CancelRideDto,
} from 'src/dtos/booking.dto';
import { AuthGuard } from 'src/commons/security/guard';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { UserType } from 'src/enums/user.enum';
import { Roles } from 'src/commons/decorator/roles.decorator';
import { Authenticated } from 'src/commons/decorator/auth.decorator';
import { ApiResponses } from 'src/dtos/response';
import { CurrentUser } from 'src/commons/decorator/current-user.decorator';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';

@ApiTags('Bookings')
@Controller('api/v1/bookings')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserType.ADMIN, UserType.CUSTOMER)
@Authenticated()
export class BookingController {
  constructor(
    @Inject(BOOKING_SERVICE)
    private readonly bookingService: BookingService,
  ) {}

  @Post()
  @Roles(UserType.CUSTOMER)
  @ApiOperation({ summary: 'Create a new car booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: BookingResponseDto,
  })
  async createBooking(
    @Body() dto: CreateBookingDto,
    @CurrentUser() currentUser: UserDetails,
  ): Promise<ApiResponses<BookingResponseDto>> {
    return this.bookingService.createBooking(currentUser, dto);
  }

  @Get()
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  @ApiOperation({
    summary: 'Get list of bookings with pagination and status filter',
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
    description: 'Bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  async getBookings(
    @CurrentUser() currentUser: UserDetails,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<ApiResponses<BookingResponseDto[]>> {
    return this.bookingService.getCustomerBookings(currentUser, {
      status,
      page,
      limit,
    });
  }

  @Patch('accept')
  @Roles(UserType.DRIVER, UserType.ADMIN)
  @ApiOperation({ summary: 'Accept a ride booking (Driver only)' })
  @ApiBody({ type: AcceptRideDto })
  @ApiResponse({
    status: 200,
    description: 'Ride accepted successfully',
    type: BookingResponseDto,
  })
  async acceptRide(
    @Body() dto: AcceptRideDto,
    @CurrentUser() currentUser: UserDetails,
  ): Promise<ApiResponses<BookingResponseDto>> {
    return this.bookingService.acceptRide(currentUser, dto);
  }

  @Patch('cancel')
  @Roles(UserType.CUSTOMER, UserType.DRIVER, UserType.ADMIN)
  @ApiOperation({
    summary: 'Cancel a ride booking (Customer, Driver, or Admin)',
  })
  @ApiBody({ type: CancelRideDto })
  @ApiResponse({
    status: 200,
    description: 'Ride cancelled successfully',
    type: BookingResponseDto,
  })
  async cancelRide(
    @Body() dto: CancelRideDto,
    @CurrentUser() currentUser: UserDetails,
  ): Promise<ApiResponses<BookingResponseDto>> {
    return this.bookingService.cancelRide(currentUser, dto);
  }

  @Get('driver')
  @Roles(UserType.DRIVER, UserType.ADMIN)
  @ApiOperation({
    summary: 'Get driver bookings with pagination and status filter',
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
    return this.bookingService.getDriverBookings(currentUser, {
      status,
      page,
      limit,
    });
  }
}
