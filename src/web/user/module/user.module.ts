// src/web/users/users.module.ts
import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { USER_SERVICE } from '../interface/user.service'; // adjust path if needed
import { UserServiceImpl } from '../services/user.serviceImp';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { AuthGuard } from 'src/commons/security/guard';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserServiceImpl,
    },
    RolesGuard,
    AuthGuard,
  ],
})
export class UserModule {}
