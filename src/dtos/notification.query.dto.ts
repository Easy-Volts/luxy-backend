import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListNotificationsQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 'false',
    description: 'Filter by read state',
  })
  @IsOptional()
  @IsBooleanString()
  read?: string;

  @ApiPropertyOptional({ example: 'RIDE_BOOKED' })
  @IsOptional()
  @IsString()
  type?: string;
}
