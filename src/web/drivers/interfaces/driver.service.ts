import { ApiResponses } from 'src/dtos/response';
import { BookingResponseDto } from 'src/dtos/booking.dto';
import { ReviewResponseDto, ReviewStatsDto } from 'src/dtos/review.dto';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';

export const DRIVER_SERVICE = Symbol('DRIVER_SERVICE');

export interface DriverService {
  getDriverBookings(
    user: UserDetails,
    options?: { status?: string; page?: number; limit?: number }
  ): Promise<ApiResponses<BookingResponseDto[]>>;

  getDriverRatings(
    user: UserDetails,
  ): Promise<ApiResponses<ReviewResponseDto[]>>;

  getDriverRatingStats(
    user: UserDetails,
  ): Promise<ApiResponses<ReviewStatsDto>>;
}
