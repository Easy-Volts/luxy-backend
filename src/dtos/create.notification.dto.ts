// src/dtos/notification.create.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from 'src/domain/entities/notification.model';

export class CreateNotificationDto {
  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.RIDE_BOOKED,
  })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiProperty({ example: 'Ride Booked Successfully' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    required: false,
    example: 'Rental prices vary depending on the car, location, and duration.',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({ required: false, example: 'calendar' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false, example: { bookingId: 987 } })
  @IsOptional()
  meta?: Record<string, any>;
}
