import { ApiResponses } from 'src/dtos/response';
import { CreateBookingDto, BookingResponseDto } from 'src/dtos/booking.dto';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';

export const BOOKING_SERVICE = Symbol('BOOKING_SERVICE');

export interface BookingService {
  createBooking(
    user: UserDetails,
    dto: CreateBookingDto,
  ): Promise<ApiResponses<BookingResponseDto>>;

  getCustomerBookings(
    user: UserDetails,
  ): Promise<ApiResponses<BookingResponseDto[]>>;

  getAllBookings(): Promise<ApiResponses<BookingResponseDto[]>>;
}
