import { ApiResponses } from 'src/dtos/response';
import { CreateBookingDto, BookingResponseDto } from 'src/dtos/booking.dto';

export const BOOKING_SERVICE = Symbol('BOOKING_SERVICE');

export interface BookingService {
  createBooking(
    customerId: number,
    dto: CreateBookingDto,
  ): Promise<ApiResponses<BookingResponseDto>>;

  getCustomerBookings(
    customerId: number,
  ): Promise<ApiResponses<BookingResponseDto[]>>;

  getAllBookings(): Promise<ApiResponses<BookingResponseDto[]>>;
}
