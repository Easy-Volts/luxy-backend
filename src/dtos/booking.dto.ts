import {
  IsDateString,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from 'src/enums/user.enum';
import { PaymentInitResponse } from './payment-init-response.dto';

export class CreateBookingDto {
  @ApiProperty({ description: 'Car ID to book' })
  @IsNotEmpty()
  @IsNumber()
  carId!: number;

  @ApiProperty({ description: 'Start date of booking (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  startDate!: string;

  @ApiProperty({ description: 'End date of booking (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  endDate!: string;

  @ApiProperty({ description: 'Start time (HH:MM)', example: '10:00' })
  @IsNotEmpty()
  @IsString()
  startTime!: string;

  @ApiProperty({ description: 'End time (HH:MM)', example: '18:00' })
  @IsNotEmpty()
  @IsString()
  endTime!: string;

  @ApiPropertyOptional({ description: 'Special requests for the booking' })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({ description: 'Pickup location' })
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @ApiPropertyOptional({ description: 'Return location' })
  @IsOptional()
  @IsString()
  returnLocation?: string;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;
}

export class BookingResponseDto {
  paymentInitResponse!: PaymentInitResponse;
  id?: number;
  bookingReference!: string;
  bookingCode!: string;
  carId!: number;
  carDetails?: {
    make: string;
    model: string;
    year: number;
    color?: string;
    licensePlate?: string;
    brand?: {
      name: string;
      image: string;
    };
  };
  startDate!: string;
  endDate!: string;
  startTime!: string;
  endTime!: string;
  totalDays!: number;
  pricePerDay!: number;
  totalAmount!: number;
  status!: string;
  paymentStatus!: string;
  paymentMethod?: string;
  createdAt?: Date;
}
