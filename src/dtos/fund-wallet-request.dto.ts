import { IsNotEmpty, IsNumber, IsEmail, Min, IsOptional, IsString } from 'class-validator';

export class FundWalletRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string = 'NGN';

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  callback_url?: string;

  @IsOptional()
  @IsString()
  metadata?: any;
}