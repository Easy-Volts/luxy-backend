import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/repository/user.repository';
import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { Users } from '../../../domain/entities/user.model';
import { UserService } from '../interface/user.service';
@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateUserLocation(
    userId: number,
    dto: UpdateLocationDto,
  ): Promise<Users> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    return this.userRepository.saveUser(user);
  }
}
