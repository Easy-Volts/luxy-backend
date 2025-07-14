import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppRequest } from './app.request';
export class VerifyOTPDto extends AppRequest {
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
