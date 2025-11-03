import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from 'src/enums/user.enum';
export class CreateAccountDto {
  @ApiPropertyOptional({
    enum: UserType,
    default: UserType.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType = UserType.CUSTOMER;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password?: string;
}
