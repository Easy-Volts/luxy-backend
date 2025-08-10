import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class VerifyOTPDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp?: string;
}
