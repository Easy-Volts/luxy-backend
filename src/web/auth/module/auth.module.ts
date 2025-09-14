import { Module } from '@nestjs/common';
import { AuthController } from 'src/web/auth/auth.controller';
import { CustomerRepository } from 'src/domain/repository/customer.repository';
import { AuthGuard } from 'src/commons/security/guard';
import { JWTStrategy } from 'src/commons/security/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AUTH_SERVICE } from '../interface/auth.service';
import { AuthServiceImpl } from '../services/auth.serviceImpl';
import { WalletRepository } from 'src/domain/repository/wallet.repository';
import { RabbitMQService } from 'src/ampq/service/rabbitMQ';
import { ListenerServiceImpl } from 'src/ampq/service/ampq.serviceImpl';
import { SharedModule } from 'src/shared/shared.module';
dotenv.config();
const secret = process.env.JWT_SECRET ?? 'defaultSecret';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: secret,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    SharedModule,
  ],
  controllers: [AuthController],

  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthServiceImpl,
    },
    ListenerServiceImpl,
    RabbitMQService,
    CustomerRepository,
    WalletRepository,
    JWTStrategy,
    AuthGuard,
  ],
})
export class AuthModule {}
