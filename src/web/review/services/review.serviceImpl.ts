import { Injectable } from '@nestjs/common';
import { ReviewService } from '../interface/review.service';
import { ReviewRepository } from '../../../domain/repository/review.repository';
import { ApiResponses, ApiResponseBuilder } from '../../../dtos/response';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponseDto,
  ReviewStatsDto,
} from '../../../dtos/review.dto';
import { Review } from '../../../domain/entities/review.model';

@Injectable()
export class ReviewServiceImpl implements ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(
    reviewerId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<ApiResponses<ReviewResponseDto>> {
    try {
      // Validate that reviewer is not reviewing themselves
      if (reviewerId === createReviewDto.revieweeId) {
        return new ApiResponseBuilder<ReviewResponseDto>()
          .setError('You cannot review yourself')
          .build();
      }

      const reviewData: Partial<Review> = {
        ...createReviewDto,
        reviewerId,
      };

      const createdReview = await this.reviewRepository.create(reviewData);
      const reviewWithRelations = await this.reviewRepository.findById(
        createdReview.id!,
      );

      return new ApiResponseBuilder<ReviewResponseDto>()
        .setMessage('Review created successfully')
        .setData(this.mapToResponseDto(reviewWithRelations!))
        .build();
    } catch {
      return new ApiResponseBuilder<ReviewResponseDto>()
        .setError('Failed to create review')
        .build();
    }
  }

  async getReviewById(id: number): Promise<ApiResponses<ReviewResponseDto>> {
    try {
      const review = await this.reviewRepository.findById(id);

      if (!review) {
        return new ApiResponseBuilder<ReviewResponseDto>()
          .setError('Review not found')
          .build();
      }

      return new ApiResponseBuilder<ReviewResponseDto>()
        .setMessage('Review retrieved successfully')
        .setData(this.mapToResponseDto(review))
        .build();
    } catch {
      return new ApiResponseBuilder<ReviewResponseDto>()
        .setError('Failed to retrieve review')
        .build();
    }
  }

  async getReviewsByRevieweeId(
    revieweeId: number,
    reviewType?: string,
  ): Promise<ApiResponses<ReviewResponseDto[]>> {
    try {
      const reviews = await this.reviewRepository.findByRevieweeId(revieweeId);
      
      // Filter by review type if provided
      const filteredReviews = reviewType
        ? reviews.filter((review) => review.reviewType === reviewType)
        : reviews;

      const reviewDtos = filteredReviews.map((review) =>
        this.mapToResponseDto(review),
      );

      return new ApiResponseBuilder<ReviewResponseDto[]>()
        .setMessage('Reviews retrieved successfully')
        .setData(reviewDtos)
        .build();
    } catch {
      return new ApiResponseBuilder<ReviewResponseDto[]>()
        .setError('Failed to retrieve reviews')
        .build();
    }
  }

  async getReviewsByReviewerId(
    reviewerId: number,
  ): Promise<ApiResponses<ReviewResponseDto[]>> {
    try {
      const reviews = await this.reviewRepository.findByReviewerId(reviewerId);
      const reviewDtos = reviews.map((review) => this.mapToResponseDto(review));

      return new ApiResponseBuilder<ReviewResponseDto[]>()
        .setMessage('Reviews retrieved successfully')
        .setData(reviewDtos)
        .build();
    } catch {
      return new ApiResponseBuilder<ReviewResponseDto[]>()
        .setError('Failed to retrieve reviews')
        .build();
    }
  }

  async getReviewsByCarId(
    carId: number,
  ): Promise<ApiResponses<ReviewResponseDto[]>> {
    try {
      const reviews = await this.reviewRepository.findByCarId(carId);
      const reviewDtos = reviews.map((review) => this.mapToResponseDto(review));

      return new ApiResponseBuilder<ReviewResponseDto[]>()
        .setMessage('Car reviews retrieved successfully')
        .setData(reviewDtos)
        .build();
    } catch {
      return new ApiResponseBuilder<ReviewResponseDto[]>()
        .setError('Failed to retrieve car reviews')
        .build();
    }
  }

  async getReviewStats(
    revieweeId: number,
    reviewType?: string,
  ): Promise<ApiResponses<ReviewStatsDto>> {
    try {
      const [averageRating, totalReviews, ratingDistribution] =
        await Promise.all([
          this.reviewRepository.getAverageRating(revieweeId, reviewType),
          this.reviewRepository.getTotalReviewsCount(revieweeId, reviewType),
          this.reviewRepository.getRatingDistribution(revieweeId, reviewType),
        ]);

      // Calculate percentages for rating distribution
      const distributionWithPercentages = ratingDistribution.map((item) => ({
        rating: item.rating,
        count: parseInt(item.count),
        percentage:
          totalReviews > 0
            ? Math.round((parseInt(item.count) / totalReviews) * 100)
            : 0,
      }));

      const stats: ReviewStatsDto = {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        totalReviews,
        ratingDistribution: distributionWithPercentages,
      };

      return new ApiResponseBuilder<ReviewStatsDto>()
        .setMessage('Review statistics retrieved successfully')
        .setData(stats)
        .build();
    } catch {
      return new ApiResponseBuilder<ReviewStatsDto>()
        .setError('Failed to retrieve review statistics')
        .build();
    }
  }

  async updateReview(
    id: number,
    reviewerId: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ApiResponses<ReviewResponseDto>> {
    try {
      const existingReview = await this.reviewRepository.findById(id);

      if (!existingReview) {
        return new ApiResponseBuilder<ReviewResponseDto>()
          .setError('Review not found')
          .build();
      }

      // Check if the reviewer owns this review
      if (existingReview.reviewerId !== reviewerId) {
        return new ApiResponseBuilder<ReviewResponseDto>()
          .setError('You can only update your own reviews')
          .build();
      }

      const updatedReview = await this.reviewRepository.update(
        id,
        updateReviewDto,
      );

      return new ApiResponseBuilder<ReviewResponseDto>()
        .setMessage('Review updated successfully')
        .setData(this.mapToResponseDto(updatedReview!))
        .build();
    } catch {
      return new ApiResponseBuilder<ReviewResponseDto>()
        .setError('Failed to update review')
        .build();
    }
  }

  async deleteReview(
    id: number,
    reviewerId: number,
  ): Promise<ApiResponses<{ message: string }>> {
    try {
      const existingReview = await this.reviewRepository.findById(id);

      if (!existingReview) {
        return new ApiResponseBuilder<{ message: string }>()
          .setError('Review not found')
          .build();
      }

      // Check if the reviewer owns this review
      if (existingReview.reviewerId !== reviewerId) {
        return new ApiResponseBuilder<{ message: string }>()
          .setError('You can only delete your own reviews')
          .build();
      }

      await this.reviewRepository.delete(id);

      return new ApiResponseBuilder<{ message: string }>()
        .setMessage('Review deleted successfully')
        .setData({ message: 'Review has been successfully deleted' })
        .build();
    } catch {
      return new ApiResponseBuilder<{ message: string }>()
        .setError('Failed to delete review')
        .build();
    }
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      reviewerId: review.reviewerId,
      revieweeId: review.revieweeId,
      carId: review.carId,
      reviewType: review.reviewType,
      bookingId: review.bookingId,
      isActive: review.isActive,
      dateCreated: review.dateCreated,
      lastUpdated: review.lastUpdated,
      reviewer: review.reviewer
        ? {
            id: review.reviewer.id!,
            firstName: review.reviewer.firstName || '',
            lastName: review.reviewer.lastName || '',
            imageUrl: review.reviewer.imageUrl,
          }
        : undefined,
      reviewee: review.reviewee
        ? {
            id: review.reviewee.id!,
            firstName: review.reviewee.firstName || '',
            lastName: review.reviewee.lastName || '',
            imageUrl: review.reviewee.imageUrl,
          }
        : undefined,
      car: review.car
        ? {
            id: review.car.id!,
            make: review.car.make,
            model: review.car.model,
            year: review.car.year,
          }
        : undefined,
    };
  }
}
