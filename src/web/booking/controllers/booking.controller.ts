import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Inject,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { BOOKING_SERVICE, BookingService } from '../interface/booking.service';
import {
  CreateBookingDto,
  BookingResponseDto,
  GetBookingsQueryDto,
} from '../../../dtos/booking.dto';
import { ApiResponses } from '../../../dtos/response';
import { AuthGuard } from '../../../commons/security/guard';
import { RolesGuard } from '../../../commons/security/roles.guard';
import { UserType } from '../../../enums/user.enum';
import { Roles } from '../../../commons/decorator/roles.decorator';
import { Authenticated } from '../../../commons/decorator/auth.decorator';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard, RolesGuard)
@Authenticated()
@Roles(UserType.CUSTOMER)
export class BookingController {
  constructor(
    @Inject(BOOKING_SERVICE) private readonly bookingService: BookingService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed or car not available',
  })
  @ApiResponse({
    status: 404,
    description: 'Car or customer not found',
  })
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: { user: { userId: number } },
  ): Promise<ApiResponses<BookingResponseDto>> {
    const userId = req.user.userId;
    return this.bookingService.createBooking(null, userId, createBookingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get customer bookings with pagination and filters',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by booking status',
  })
  @ApiQuery({
    name: 'paymentStatus',
    required: false,
    description: 'Filter by payment status',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
  })
  async getCustomerBookings(
    @Query() query: GetBookingsQueryDto,
    @Request() req: { user: { userId: number } },
  ): Promise<
    ApiResponses<{
      bookings: BookingResponseDto[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>
  > {
    const userId = req.user.userId;

    return this.bookingService.getCustomerBookings(null, userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access to booking',
  })
  async getBookingById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { userId: number } },
  ): Promise<ApiResponses<BookingResponseDto>> {
    const userId = req.user.userId;
    return this.bookingService.getBookingById(id, null, userId);
  }
}
