import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPinDto {
  @ApiProperty({ example: '5678' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  newPin!: string;
}
