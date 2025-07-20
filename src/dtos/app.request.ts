import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from 'src/enums/user.enum';
export class AppRequest {
  @ApiProperty()
  @IsString()
  deviceId?: string;
  @ApiProperty()
  @IsString()
  deviceToken?: string;
  @ApiProperty()
  @IsString()
  version?: string;
  @ApiProperty()
  @IsEnum(UserType)
  userType?: UserType;
}
