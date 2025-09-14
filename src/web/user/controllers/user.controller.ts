import {
  Controller,
  Patch,
  Body,
  Inject,
  UseGuards,
  Put,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER_SERVICE, UserService } from '../interface/user.service';
import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { Users } from '../../../domain/entities/user.model';
import { UpdateProfileDto } from 'src/dtos/update.profile.dto';
import {
  DeactivateAccountDto,
  ActivateAccountDto,
} from 'src/dtos/account.status.dto';
import { AuthGuard } from 'src/commons/security/guard';
import { RolesGuard } from 'src/commons/security/roles.guard';
import {
  AccountStatusGuard,
  AllowInactive,
} from 'src/commons/security/account-status.guard';
import { UserType } from 'src/enums/user.enum';
import { Roles } from 'src/commons/decorator/roles.decorator';
import { Authenticated } from 'src/commons/decorator/auth.decorator';
import { ApiResponses } from 'src/dtos/response';
import { CurrentUser } from 'src/commons/decorator/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard, AccountStatusGuard)
@Authenticated()
@Roles(UserType.ADMIN, UserType.CUSTOMER)
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  @Patch('location')
  @ApiOperation({ summary: 'Update current user location' })
  @ApiResponse({
    status: 200,
    description: 'User location updated successfully',
    type: Users,
  })
  async updateUserLocation(
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateLocationDto,
  ): Promise<ApiResponses<any>> {
    return this.userService.updateUserLocation(user, dto);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: Users,
  })
  async updateProfile(
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateProfileDto,
  ): Promise<ApiResponses<any>> {
    return this.userService.updateUserProfile(user, dto);
  }

  @Patch('deactivate')
  @ApiOperation({ summary: 'Deactivate current user account' })
  @ApiResponse({
    status: 200,
    description: 'Account deactivated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Account is already deactivated or cannot be deactivated',
  })
  async deactivateAccount(
    @CurrentUser() user: { id: number },
    @Body() dto: DeactivateAccountDto,
  ): Promise<ApiResponses<any>> {
    return this.userService.deactivateAccount(user, dto);
  }

  @Patch('activate')
  @AllowInactive()
  @ApiOperation({ summary: 'Activate current user account' })
  @ApiResponse({
    status: 200,
    description: 'Account activated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Account is already active or cannot be activated',
  })
  activateAccount(
    @CurrentUser() user: { id: number },
    @Body() dto: ActivateAccountDto,
  ): Promise<ApiResponses<any>> {
    return this.userService.activateAccount(user, dto);
  }

  @Get('account-status')
  @AllowInactive()
  @ApiOperation({ summary: 'Get current user account status' })
  @ApiResponse({
    status: 200,
    description: 'Account status retrieved successfully',
  })
  getAccountStatus(
    @CurrentUser() user: { id: number },
  ): Promise<ApiResponses<any>> {
    return this.userService.getAccountStatus(user);
  }
}
