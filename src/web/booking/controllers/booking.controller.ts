import { Controller, Post, Get, Body, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BOOKING_SERVICE, BookingService } from '../interface/booking.service';
import { CreateBookingDto, BookingResponseDto } from 'src/dtos/booking.dto';
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
  @ApiOperation({ summary: 'Get list of bookings' })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  async getBookings(
    @CurrentUser() currentUser: UserDetails,
  ): Promise<ApiResponses<BookingResponseDto[]>> {
    return this.bookingService.getCustomerBookings(currentUser);

    // return this.bookingService.getAllBookings();
  }
}
