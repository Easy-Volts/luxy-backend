// car-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Brand } from 'src/domain/entities/brand.model';
import { Vendor } from 'src/domain/entities/vendor.model';

export class CarResponseDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  make?: string;

  @ApiProperty()
  model?: string;

  @ApiProperty()
  year?: number;

  @ApiProperty({ required: false })
  color?: string;

  @ApiProperty({ required: false })
  licensePlate?: string;

  @ApiProperty({ required: false })
  vin?: string;

  @ApiProperty({ required: false })
  transmissionType?: string;

  @ApiProperty({ required: false })
  fuelType?: string;

  @ApiProperty()
  hasEscort?: boolean;

  @ApiProperty({ required: false })
  conditionReport?: string;

  @ApiProperty({ type: [String], required: false })
  features?: string[];

  @ApiProperty({ required: false })
  exteriorPhotoUrl?: string;

  @ApiProperty({ required: false })
  interiorPhotoUrl?: string;

  @ApiProperty({ required: false })
  numberOfSeats?: number;

  @ApiProperty({ required: false })
  carLocation?: string;

  @ApiProperty({ required: false })
  vehicleLicenseUrl?: string;

  @ApiProperty({ required: false })
  roadworthinessUrl?: string;

  @ApiProperty({ required: false })
  ownershipCertificateUrl?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty()
  status?: string;

  @ApiProperty({ type: () => Brand })
  brand?: Brand | null;

  @ApiProperty({ type: () => Vendor })
  vendor?: Vendor | null;

  @ApiProperty()
  dateCreated?: Date;

  @ApiProperty()
  lastUpdated?: Date;
}
