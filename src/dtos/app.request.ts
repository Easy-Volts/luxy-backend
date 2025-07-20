import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from 'src/enums/user.enum';
export class AppRequest {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  deviceId?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceToken?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  version?: string;
  @ApiPropertyOptional({
    enum: UserType,
    default: UserType.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType = UserType.CUSTOMER;
}
