import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../../domain/repository/user.repository';
import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { UpdateProfileDto } from '../../../dtos/update.profile.dto';
import { DeactivateAccountDto, ActivateAccountDto } from '../../../dtos/account.status.dto';
import { UserService } from '../interface/user.service';
import { ApiResponses, ApiResponseBuilder } from 'src/dtos/response';
import { UserStatus } from 'src/enums/user.enum';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateUserLocation(
    userContext: { id: number },
    dto: UpdateLocationDto,
  ): Promise<ApiResponses<any>> {
    const user = await this.userRepository.findOneById(userContext.id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    user.locationVerified = true;

    await this.userRepository.saveUser(user);

    return new ApiResponseBuilder()
      .setMessage('User location updated successfully')
      .setData(dto)
      .build();
  }

  async updateUserProfile(
    userContext: { id: number },
    dto: UpdateProfileDto,
  ): Promise<ApiResponses<any>> {
    const user = await this.userRepository.findOneById(userContext.id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);

    await this.userRepository.saveUser(user);

    const safeUser = { ...user };
    delete safeUser.password;

    return new ApiResponseBuilder()
      .setMessage('User profile updated successfully')
      .setData(safeUser)
      .build();
  }

  async deactivateAccount(
    userContext: { id: number },
    dto: DeactivateAccountDto,
  ): Promise<ApiResponses<any>> {
    const user = await this.userRepository.findOneById(userContext.id);
    if (!user) throw new NotFoundException('User not found');

    if (user.status === UserStatus.INACTIVE) {
      throw new BadRequestException('Account is already deactivated');
    }

    if (user.status === UserStatus.DELETED) {
      throw new BadRequestException('Cannot deactivate a deleted account');
    }

    user.status = UserStatus.INACTIVE;
    await this.userRepository.saveUser(user);

    return new ApiResponseBuilder()
      .setMessage('Account deactivated successfully')
      .setData({ 
        status: user.status,
        reason: dto.reason,
        deactivatedAt: new Date() 
      })
      .build();
  }

  async activateAccount(
    userContext: { id: number },
    dto: ActivateAccountDto,
  ): Promise<ApiResponses<any>> {
    const user = await this.userRepository.findOneById(userContext.id);
    if (!user) throw new NotFoundException('User not found');

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Account is already active');
    }

    if (user.status === UserStatus.DELETED) {
      throw new BadRequestException('Cannot activate a deleted account');
    }

    user.status = UserStatus.ACTIVE;
    await this.userRepository.saveUser(user);

    return new ApiResponseBuilder()
      .setMessage('Account activated successfully')
      .setData({ 
        status: user.status,
        note: dto.note,
        activatedAt: new Date() 
      })
      .build();
  }

  async getAccountStatus(
    userContext: { id: number },
  ): Promise<ApiResponses<any>> {
    const user = await this.userRepository.findOneById(userContext.id);
    if (!user) throw new NotFoundException('User not found');

    const canActivate = user.status === UserStatus.INACTIVE || user.status === UserStatus.SUSPENDED;
    const canDeactivate = user.status === UserStatus.ACTIVE;

    return new ApiResponseBuilder()
      .setMessage('Account status retrieved successfully')
      .setData({
        status: user.status,
        lastUpdated: user.lastUpdated,
        canActivate,
        canDeactivate,
      })
      .build();
  }
}
