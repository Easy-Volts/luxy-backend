// src/dtos/pin/reset-pin.dto.ts
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPinDto {
  @ApiProperty({
    example: '5678',
    description: 'New PIN must be 4-6 digits only',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 6, { message: 'New PIN must be between 4 and 6 digits' })
  @Matches(/^\d+$/, { message: 'PIN must contain only digits' })
  newPin!: string;
}
