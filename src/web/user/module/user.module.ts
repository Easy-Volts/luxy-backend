// src/web/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../../domain/entities/user.model';
import { UserRepository } from '../../../domain/repository/user.repository'; // adjust path if needed
import { UserController } from '../controllers/user.controller';
import { UserService } from '../interface/user.service'; // adjust path if needed

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
