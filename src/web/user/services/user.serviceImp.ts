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
}
