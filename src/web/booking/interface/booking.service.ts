import {
  CreateBookingDto,
  BookingResponseDto,
  GetBookingsQueryDto,
} from '../../../dtos/booking.dto';
import { ApiResponses } from '../../../dtos/response';

export const BOOKING_SERVICE = 'BOOKING_SERVICE';

export interface BookingService {
  createBooking(
    customerId: number | null,
    userId: number,
    createBookingDto: CreateBookingDto,
  ): Promise<ApiResponses<BookingResponseDto>>;

  getCustomerBookings(
    customerId: number | null,
    userId: number,
    query: GetBookingsQueryDto,
  ): Promise<ApiResponses<{
    bookings: BookingResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>>;

  getBookingById(
    bookingId: number,
    customerId: number | null,
    userId: number,
  ): Promise<ApiResponses<BookingResponseDto>>;
}
