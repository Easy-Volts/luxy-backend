import {
  Controller,
  Post,
  Get,
  Body,
  Inject,
  UseGuards,
  Request,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody
} from '@nestjs/swagger';
import { BOOKING_SERVICE, BookingService } from '../interface/booking.service';
import { 
  CreateBookingDto, 
  BookingResponseDto
} from 'src/dtos/booking.dto';
import { AuthGuard } from 'src/commons/security/guard';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { UserType } from 'src/enums/user.enum';
import { Roles } from 'src/commons/decorator/roles.decorator';
import { Authenticated } from 'src/commons/decorator/auth.decorator';
import { ApiResponses } from 'src/dtos/response';

@ApiTags('Bookings')
@Controller('api/v1/bookings')
@UseGuards(AuthGuard, RolesGuard)
@Authenticated()
export class BookingController {
  constructor(
    @Inject(BOOKING_SERVICE) 
    private readonly bookingService: BookingService
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
    @Request() req: any,
  ): Promise<ApiResponses<BookingResponseDto>> {
    const customerId = req.user?.sub || req.user?.userId;
    return this.bookingService.createBooking(customerId, dto);
  }

  @Get()
  @Roles(UserType.CUSTOMER, UserType.ADMIN, UserType.VENDOR)
  @ApiOperation({ summary: 'Get list of bookings' })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  async getBookings(
    @Request() req: any,
  ): Promise<ApiResponses<BookingResponseDto[]>> {
    const customerId = req.user?.sub || req.user?.userId;
    const userRole = req.user?.role || req.user?.ROLE;
    
    // If user is a customer, return only their bookings
    if (userRole === UserType.CUSTOMER) {
      return this.bookingService.getCustomerBookings(customerId);
    }
    
    // If user is admin or vendor, return all bookings
    return this.bookingService.getAllBookings();
  }
}
