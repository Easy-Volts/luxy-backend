import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePinDto {
  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 6, { message: 'PIN must be between 4 and 6 digits' })
  pin!: string;
}
