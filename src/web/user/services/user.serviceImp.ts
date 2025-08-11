// src/modules/user/service/user.service.impl.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/repository/user.repository';
import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { UpdateProfileDto } from '../../../dtos/update.profile.dto';
import { UserService } from '../interface/user.service';
import { ApiResponses, ApiResponseBuilder } from 'src/dtos/response';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateUserLocation(
    userId: number,
    dto: UpdateLocationDto,
  ): Promise<ApiResponses<any>> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    user.locationVerified = true;
    user.lastUpdated = new Date();

    await this.userRepository.saveUser(user);

    return new ApiResponseBuilder()
      .setMessage('User location updated successfully')
      .setData(dto)
      .build();
  }

  async updateUserProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<ApiResponses<any>> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Merge updates
    Object.assign(user, dto);
    user.lastUpdated = new Date();

    await this.userRepository.saveUser(user);

    // Remove sensitive fields before returning
    const safeUser = { ...user };
    delete safeUser.password;

    return new ApiResponseBuilder()
      .setMessage('User profile updated successfully')
      .setData(safeUser)
      .build();
  }
}
