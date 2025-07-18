// src/web/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../../domain/entities/user.model';
import { UserRepository } from '../../../domain/repository/user.repository'; // adjust path if needed
import { UserController } from '../controllers/user.controller';
import { USER_SERVICE } from '../interface/user.service'; // adjust path if needed
import { UserServiceImpl } from '../services/user.serviceImp';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserServiceImpl,
    },

    UserRepository,
  ],
})
export class UserModule {}
