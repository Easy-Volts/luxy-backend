import { Module } from '@nestjs/common';
import { AuthController } from 'src/web/auth/controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/domain/entities/user.model';
import { Customer } from 'src/domain/entities/customer.model';
import { UserRepository } from 'src/domain/repository/user.repository';
import { AuthGuard } from 'src/commons/security/guard';
import { JWTStrategy } from 'src/commons/security/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { CustomLogger } from 'src/log/logs.service';
import { AUTH_SERVICE } from '../interface/auth.service';
import { AuthServiceImpl } from '../services/auth.serviceImpl';
import { RabbitMQService } from 'src/ampq/rabbitMQ';
import { EmailService } from 'src/email-notification/email.service';
dotenv.config();
const secret = process.env.JWT_SECRET ?? 'defaultSecret';
@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Customer]),
    JwtModule.register({
      global: true,
      secret: secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],

  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthServiceImpl,
    },
    CustomLogger,
    UserRepository,
    JWTStrategy,
    RabbitMQService,
    EmailService,
    AuthGuard,
  ],
})
export class AuthModule {}
