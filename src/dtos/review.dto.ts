import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  IsEnum,
} from 'class-validator';

export enum ReviewType {
  CAR_OWNER = 'CAR_OWNER',
  RENTER = 'RENTER',
  CAR = 'CAR',
}

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({
    description: 'Optional review comment',
    example: 'Great car and excellent service!',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'ID of the user being reviewed',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  revieweeId!: number;

  @ApiProperty({
    description: 'ID of the car being reviewed (optional)',
    example: 456,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  carId?: number;

  @ApiProperty({
    description: 'Type of review',
    enum: ReviewType,
    example: ReviewType.CAR_OWNER,
  })
  @IsNotEmpty()
  @IsEnum(ReviewType)
  reviewType!: ReviewType;

  @ApiProperty({
    description: 'ID of the associated booking/lending',
    example: 789,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  bookingId?: number;
}

export class UpdateReviewDto {
  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({
    description: 'Review comment',
    example: 'Updated review comment',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class ReviewResponseDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 5 })
  rating?: number;

  @ApiProperty({ example: 'Excellent service!' })
  comment?: string;

  @ApiProperty({ example: 123 })
  reviewerId?: number;

  @ApiProperty({ example: 456 })
  revieweeId?: number;

  @ApiProperty({ example: 789 })
  carId?: number;

  @ApiProperty({ example: 'CAR_OWNER' })
  reviewType?: string;

  @ApiProperty({ example: 101112 })
  bookingId?: number;

  @ApiProperty({ example: true })
  isActive?: boolean;

  @ApiProperty()
  dateCreated?: Date;

  @ApiProperty()
  lastUpdated?: Date;

  @ApiProperty()
  reviewer?: {
    id: number;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };

  @ApiProperty()
  reviewee?: {
    id: number;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };

  @ApiProperty()
  car?: {
    id: number;
    make: string;
    model: string;
    year: number;
  };
}

export class ReviewStatsDto {
  @ApiProperty({ example: 4.5 })
  averageRating?: number;

  @ApiProperty({ example: 367 })
  totalReviews?: number;

  @ApiProperty({
    example: [
      { rating: 5, count: 86, percentage: 86 },
      { rating: 4, count: 16, percentage: 16 },
      { rating: 3, count: 12, percentage: 12 },
      { rating: 2, count: 8, percentage: 8 },
      { rating: 1, count: 4, percentage: 4 },
    ],
  })
  ratingDistribution?: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}
