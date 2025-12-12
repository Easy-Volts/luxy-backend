import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserStatus } from 'src/enums/user.enum';

export class UpdateDriverStatusDto {
  @ApiProperty({
    description: 'New status for the driver',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(UserStatus, { message: 'Status must be a valid UserStatus value' })
  status!: UserStatus;

  @ApiProperty({
    description: 'Reason for status change (optional, recommended for SUSPENDED)',
    example: 'Multiple customer complaints',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class DriverStatusResponseDto {
  @ApiProperty({
    description: 'Driver ID',
    example: 1,
  })
  driverId!: number;

  @ApiProperty({
    description: 'User ID',
    example: 123,
  })
  userId!: number;

  @ApiProperty({
    description: 'Driver name',
    example: 'John Doe',
  })
  name!: string;

  @ApiProperty({
    description: 'New status of the driver',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @ApiProperty({
    description: 'Previous status of the driver',
    enum: UserStatus,
    example: UserStatus.INACTIVE,
  })
  previousStatus!: UserStatus;

  @ApiProperty({
    description: 'Reason for status change',
    example: 'Account verification completed',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description: 'Timestamp of status change',
    example: '2025-12-12T10:30:00.000Z',
  })
  updatedAt!: Date;
}
