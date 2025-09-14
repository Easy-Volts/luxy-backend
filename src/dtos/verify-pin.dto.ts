// src/dtos/pin/verify-pin.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPinDto {
  @ApiProperty({
    example: '1234',
    description: 'PIN to verify',
  })
  @IsString()
  @IsNotEmpty()
  pin!: string;
}
