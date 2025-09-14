import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Inject,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PinService, PIN_SERVICE } from '../interface/pin.service';
import { CreatePinDto } from '../../../dtos/create-pin.dto';
import { VerifyPinDto } from '../../../dtos/verify-pin.dto';
import { ResetPinDto } from '../../../dtos/reset-pin.dto';
import { AuthGuard } from '../../../commons/security/guard';
import { RolesGuard } from '../../../commons/security/roles.guard';
import { AccountStatusGuard } from '../../../commons/security/account-status.guard';
import { Roles } from '../../../commons/decorator/roles.decorator';
import { Authenticated } from '../../../commons/decorator/auth.decorator';
import { CurrentUser } from '../../../commons/decorator/current-user.decorator';
import { UserType } from '../../../enums/user.enum';
import { ApiResponses } from '../../../dtos/response';

@ApiTags('PIN Management')
@Controller('pin')
@UseGuards(AuthGuard, RolesGuard, AccountStatusGuard)
@Authenticated()
@Roles(UserType.CUSTOMER, UserType.ADMIN)
export class PinController {
  constructor(
    @Inject(PIN_SERVICE)
    private readonly pinService: PinService,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user PIN' })
  @ApiResponse({
    status: 201,
    description: 'PIN created successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'PIN already exists or validation failed',
  })
  async createPin(
    @CurrentUser() user: { userId: number },
    @Body() dto: CreatePinDto,
  ): Promise<ApiResponses<any>> {
    return this.pinService.createPin(user, dto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user PIN' })
  @ApiResponse({
    status: 200,
    description: 'PIN verified successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Invalid PIN' })
  @ApiResponse({
    status: 401,
    description: 'Too many failed attempts - account locked',
  })
  @ApiResponse({ status: 404, description: 'PIN not found' })
  async verifyPin(
    @CurrentUser() user: { userId: number },
    @Body() dto: VerifyPinDto,
  ): Promise<ApiResponses<any>> {
    return this.pinService.verifyPin(user, dto);
  }

  @Patch('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user PIN' })
  @ApiResponse({
    status: 200,
    description: 'PIN reset successfully',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'PIN not found' })
  async resetPin(
    @CurrentUser() user: { userId: number },
    @Body() dto: ResetPinDto,
  ): Promise<ApiResponses<any>> {
    return this.pinService.resetPin(user, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user PIN' })
  @ApiResponse({
    status: 200,
    description: 'PIN deleted successfully',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'PIN not found' })
  async deletePin(
    @CurrentUser() user: { userId: number },
  ): Promise<ApiResponses<any>> {
    return this.pinService.deletePin(user);
  }

  @Get('exists')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if user has a PIN' })
  @ApiResponse({
    status: 200,
    description: 'PIN existence status retrieved',
    type: Object,
  })
  async checkPinExists(
    @CurrentUser() user: { userId: number },
  ): Promise<ApiResponses<any>> {
    return this.pinService.checkPinExists(user);
  }
}
