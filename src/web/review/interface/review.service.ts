import { ApiResponses } from 'src/dtos/response';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponseDto,
  ReviewStatsDto,
} from '../../../dtos/review.dto';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';

export const REVIEW_SERVICE = Symbol('REVIEW_SERVICE');

export interface ReviewService {
  createReview(
    reviewerId: UserDetails,
    createReviewDto: CreateReviewDto,
  ): Promise<ApiResponses<ReviewResponseDto>>;

  getReviewById(id: number): Promise<ApiResponses<ReviewResponseDto>>;

  getReviewsByRevieweeId(
    revieweeId: number,
    reviewType?: string,
  ): Promise<ApiResponses<ReviewResponseDto[]>>;

  getReviewsByReviewerId(
    reviewerId: number,
  ): Promise<ApiResponses<ReviewResponseDto[]>>;

  getReviewsByCarId(carId: number): Promise<ApiResponses<ReviewResponseDto[]>>;

  getReviewStats(
    revieweeId: number,
    reviewType?: string,
  ): Promise<ApiResponses<ReviewStatsDto>>;

  updateReview(
    id: number,
    reviewerId: UserDetails,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ApiResponses<ReviewResponseDto>>;

  deleteReview(
    id: number,
    reviewerId: UserDetails,
  ): Promise<ApiResponses<{ message: string }>>;
}
