import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { UserStatus } from 'src/enums/user.enum';

export class DeactivateAccountDto {
  @ApiProperty({
    description: 'Optional reason for deactivating the account',
    example: 'Taking a break from the service',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class ActivateAccountDto {
  @ApiProperty({
    description: 'Optional note about account reactivation',
    example: 'Ready to use the service again',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class AccountStatusResponseDto {
  @ApiProperty({
    description: 'Current account status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status?: UserStatus;

  @ApiProperty({
    description: 'Last status change timestamp',
    example: '2025-09-11T10:30:00Z',
  })
  lastUpdated?: Date;

  @ApiProperty({
    description: 'Whether the account can be activated',
    example: true,
  })
  canActivate?: boolean;

  @ApiProperty({
    description: 'Whether the account can be deactivated',
    example: true,
  })
  canDeactivate?: boolean;
}
