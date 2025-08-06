import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsInt,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Car ID to book',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  carId!: number;

  @ApiProperty({
    description: 'Start date of booking',
    example: '2024-03-01',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({
    description: 'End date of booking',
    example: '2024-03-07',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @ApiProperty({
    description: 'Start time of booking',
    example: '16:00',
  })
  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @ApiProperty({
    description: 'End time of booking',
    example: '18:00',
  })
  @IsString()
  @IsNotEmpty()
  endTime!: string;

  @ApiProperty({
    description: 'Pickup location',
    example: 'Port Harcourt Airport',
    required: false,
  })
  @IsString()
  @IsOptional()
  pickupLocation?: string;

  @ApiProperty({
    description: 'Drop-off location',
    example: 'Hotel location',
    required: false,
  })
  @IsString()
  @IsOptional()
  dropoffLocation?: string;

  @ApiProperty({
    description: 'Any special requests',
    example: 'Please ensure the car is clean',
    required: false,
  })
  @IsString()
  @IsOptional()
  specialRequests?: string;
}

export class BookingResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  bookingReference!: string;

  @ApiProperty()
  carId!: number;

  @ApiProperty()
  car!: {
    id: number;
    make: string;
    model: string;
    year: number;
    color: string;
    exteriorPhotoUrl: string;
    pricePerDay: number;
  };

  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  endDate!: Date;

  @ApiProperty()
  startTime!: string;

  @ApiProperty()
  endTime!: string;

  @ApiProperty()
  numberOfDays!: number;

  @ApiProperty()
  pricePerDay!: number;

  @ApiProperty()
  totalAmount!: number;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  paymentStatus!: string;

  @ApiProperty()
  pickupLocation?: string;

  @ApiProperty()
  dropoffLocation?: string;

  @ApiProperty()
  specialRequests?: string;

  @ApiProperty()
  dateCreated!: Date;
}

export class GetBookingsQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by booking status',
    example: 'PENDING',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Filter by payment status',
    example: 'PAID',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentStatus?: string;
}
