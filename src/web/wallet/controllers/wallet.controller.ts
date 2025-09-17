import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { FundWalletRequestDto } from 'src/dtos/fund-wallet-request.dto';
import { AuthGuard } from 'src/commons/security/guard';
import { CurrentUser } from 'src/commons/decorator/current-user.decorator';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('fund/initiate')
  @HttpCode(HttpStatus.OK)
  async initiateFundWallet(
    @Body() fundWalletDto: FundWalletRequestDto,
    @CurrentUser() user: any,
  ) {
    return await this.walletService.initiateFundWallet(
      fundWalletDto,
      user.userId,
    );
  }

  @Post('fund/verify/:reference')
  @HttpCode(HttpStatus.OK)
  async verifyFundWallet(@Param('reference') reference: string) {
    return await this.walletService.verifyAndProcessFundWallet(reference);
  }

  @Post('fund/callback')
  @HttpCode(HttpStatus.OK)
  async handleFundWalletCallback(@Body() callbackData: any) {
    // Paystack callback handler
    const { reference, event } = callbackData;
    
    if (event === 'charge.success' && reference) {
      return await this.walletService.verifyAndProcessFundWallet(reference);
    }
    
    return { message: 'Callback received' };
  }

  @Get('balance')
  async getWalletBalance(@CurrentUser() user: any) {
    const balance = await this.walletService.getWalletBalance(user.userId);
    return {
      success: true,
      data: {
        balance,
        currency: 'NGN',
      },
    };
  }

  @Get('details')
  async getWalletDetails(@CurrentUser() user: any) {
    const walletDetails = await this.walletService.getWalletDetails(user.userId);
    return {
      success: true,
      data: walletDetails,
    };
  }
}