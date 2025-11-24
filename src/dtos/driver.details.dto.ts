import { ApiProperty } from '@nestjs/swagger';

export class DriverStatsDto {
  @ApiProperty({ example: 7500, description: 'Total number of customers served' })
  totalCustomers!: number;

  @ApiProperty({ example: 10, description: 'Years of driving experience' })
  yearsExperience!: number;

  @ApiProperty({ example: 4.9, description: 'Average rating out of 5' })
  averageRating!: number;

  @ApiProperty({ example: 4956, description: 'Total number of reviews' })
  totalReviews!: number;
}

export class DriverCarDetailsDto {
  @ApiProperty({ example: 'Cadillac Escalade 2021', description: 'Car model and year' })
  carModel?: string;

  @ApiProperty({ example: 'GR 678 KJA', description: 'Car license plate number' })
  carNumber?: string;

  @ApiProperty({ example: 'Black', description: 'Car color' })
  carColor?: string;

  @ApiProperty({ example: 1, description: 'Car ID' })
  carId?: number;

  @ApiProperty({ example: 'Cadillac', description: 'Car make' })
  make?: string;

  @ApiProperty({ example: 'Escalade', description: 'Car model name' })
  model?: string;

  @ApiProperty({ example: 2021, description: 'Car year' })
  year?: number;
}

export class DriverContactDto {
  @ApiProperty({ example: 'Unique', description: 'Driver name/username' })
  name!: string;

  @ApiProperty({ example: 'Driver', description: 'Role/designation' })
  role!: string;

  @ApiProperty({ example: 'https://example.com/driver-image.jpg', description: 'Driver profile image URL' })
  imageUrl?: string;

  @ApiProperty({ example: 1, description: 'Driver user ID' })
  userId!: number;
}

export class DriverDetailsResponseDto {
  @ApiProperty({ example: 1, description: 'Driver ID' })
  id!: number;

  @ApiProperty({ example: 'Jenny Wilson', description: 'Driver full name' })
  name!: string;

  @ApiProperty({ example: 'Uniqdesign18@gmail.com', description: 'Driver email address' })
  email!: string;

  @ApiProperty({ example: 'Lagos, Nigeria', description: 'Driver location' })
  location?: string;

  @ApiProperty({ example: 'https://example.com/profile-image.jpg', description: 'Driver profile image URL' })
  imageUrl?: string;

  @ApiProperty({ example: '+234-xxx-xxx-xxxx', description: 'Driver phone number' })
  phone?: string;

  @ApiProperty({ description: 'Driver statistics', type: DriverStatsDto })
  stats!: DriverStatsDto;

  @ApiProperty({ example: 'The Porsche 718 Cayman stands out as a symbol of precision engineering, performance prowess, and timeless elegance in the world of sports cars.', description: 'Driver bio/about section' })
  about?: string;

  @ApiProperty({ description: 'Driver contact information', type: DriverContactDto })
  contact!: DriverContactDto;

  @ApiProperty({ description: 'Car details', type: DriverCarDetailsDto, required: false })
  carDetails?: DriverCarDetailsDto;

  @ApiProperty({ example: true, description: 'KYC verification status' })
  kycVerified?: boolean;

  @ApiProperty({ example: 'ACTIVE', description: 'Driver account status' })
  status?: string;

  @ApiProperty({ description: 'Date the driver joined' })
  dateCreated?: Date;
}
