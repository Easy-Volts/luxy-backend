// ==================== DTOS ====================

// src/dtos/pin/create-pin.dto.ts
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePinDto {
  @ApiProperty({
    example: '1234',
    description: 'PIN must be 4-6 digits only',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 6, { message: 'PIN must be between 4 and 6 digits' })
  @Matches(/^\d+$/, { message: 'PIN must contain only digits' })
  pin!: string;
}
