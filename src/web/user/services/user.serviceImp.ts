import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/repository/user.repository';
import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { UserService } from '../interface/user.service';
import { ApiResponses } from 'src/dtos/response';
import { apiResponse } from 'src/commons/utils/mapper';
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
    return apiResponse(true, 'User location updated successfully', dto);
  }
}
