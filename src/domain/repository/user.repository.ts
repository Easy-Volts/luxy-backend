import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async saveUser(newUser: Users): Promise<Users> {
    return this.userRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  async findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }
  async findOneById(id: number): Promise<Users | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
