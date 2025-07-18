import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/repository/user.repository'; // adjust path if needed
import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { Users } from '../../../domain/entities/user.model'; // or user.model, whichever is correct
@Injectable()
export class UserService {
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
