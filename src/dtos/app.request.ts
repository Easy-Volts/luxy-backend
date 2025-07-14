import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
}
