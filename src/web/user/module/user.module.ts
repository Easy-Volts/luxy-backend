// src/web/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../../domain/entities/user.model';
import { UserRepository } from '../../../domain/repository/user.repository'; // adjust path if needed
import { UserController } from '../controllers/user.controller';
import { USER_SERVICE } from '../interface/user.service'; // adjust path if needed
import { UserServiceImpl } from '../services/user.serviceImp';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { AuthGuard } from 'src/commons/security/guard';
import { CustomLogger } from 'src/log/logs.service';
import { AuthModule } from 'src/web/auth/module/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), AuthModule],
  controllers: [UserController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserServiceImpl,
    },
    RolesGuard,
    AuthGuard,
    CustomLogger,

    UserRepository,
  ],
})
export class UserModule {}
