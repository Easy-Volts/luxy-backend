import { ApiResponses } from 'src/dtos/response';
import {
  CreateBookingDto,
  BookingResponseDto,
  AcceptRideDto,
  CancelRideDto,
} from 'src/dtos/booking.dto';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';

export const BOOKING_SERVICE = Symbol('BOOKING_SERVICE');

export interface BookingService {
  createBooking(
    user: UserDetails,
    dto: CreateBookingDto,
  ): Promise<ApiResponses<BookingResponseDto>>;

  getCustomerBookings(
    user: UserDetails,
    options?: { status?: string; page?: number; limit?: number },
  ): Promise<ApiResponses<BookingResponseDto[]>>;

  getAllBookings(): Promise<ApiResponses<BookingResponseDto[]>>;

  acceptRide(
    user: UserDetails,
    dto: AcceptRideDto,
  ): Promise<ApiResponses<BookingResponseDto>>;

  cancelRide(
    user: UserDetails,
    dto: CancelRideDto,
  ): Promise<ApiResponses<BookingResponseDto>>;

  getDriverBookings(
    user: UserDetails,
    options?: { status?: string; page?: number; limit?: number },
  ): Promise<ApiResponses<BookingResponseDto[]>>;
}

