import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppRequest } from './app.request';
export class CreateAccountDto extends AppRequest {
  @ApiProperty()
  @IsString()
  location?: string;
  @ApiProperty()
  @IsString()
  state?: string;
  @ApiProperty()
  @IsString()
  phone?: string;
  @ApiProperty()
  @IsString()
  fullName?: string;
  @ApiProperty()
  @IsString()
  city?: string;
  @IsString()
  @ApiProperty()
  country?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password?: string;
}
