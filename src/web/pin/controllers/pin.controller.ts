import {
  Controller,
  Post,
  Patch,
  Body,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PIN_SERVICE, PinService } from '../interface/pin.service';
import { CreatePinDto } from '../../../dtos/create-pin.dto';
import { VerifyPinDto } from '../../../dtos/verify-pin.dto';
import { ResetPinDto } from '../../../dtos/reset-pin.dto';
import { AuthGuard } from 'src/commons/security/guard';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { AccountStatusGuard } from 'src/commons/security/account-status.guard';
import { Roles } from 'src/commons/decorator/roles.decorator';
import { Authenticated } from 'src/commons/decorator/auth.decorator';
import { CurrentUser } from 'src/commons/decorator/current-user.decorator';
import { UserType } from 'src/enums/user.enum';
import { ApiResponses } from 'src/dtos/response';

@ApiTags('PIN')
@Controller('pin')
@UseGuards(AuthGuard, RolesGuard, AccountStatusGuard)
@Authenticated()
@Roles(UserType.CUSTOMER, UserType.ADMIN)
export class PinController {
  constructor(@Inject(PIN_SERVICE) private readonly pinService: PinService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create user PIN' })
  @ApiResponse({ status: 201, description: 'PIN created successfully' })
  async createPin(
    @CurrentUser() user: { id: number },
    @Body() dto: CreatePinDto,
  ): Promise<ApiResponses<any>> {
    return this.pinService.createPin(user, dto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user PIN' })
  @ApiResponse({ status: 200, description: 'PIN verified successfully' })
  async verifyPin(
    @CurrentUser() user: { id: number },
    @Body() dto: VerifyPinDto,
  ): Promise<ApiResponses<any>> {
    return this.pinService.verifyPin(user, dto);
  }

  @Patch('reset')
  @ApiOperation({ summary: 'Reset user PIN' })
  @ApiResponse({ status: 200, description: 'PIN reset successfully' })
  async resetPin(
    @CurrentUser() user: { id: number },
    @Body() dto: ResetPinDto,
  ): Promise<ApiResponses<any>> {
    return this.pinService.resetPin(user, dto);
  }
}
