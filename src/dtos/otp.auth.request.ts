import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ResendOTPDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;
}
