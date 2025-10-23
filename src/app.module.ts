import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './config/ormconfig';
import { LoggerModule } from './log/logger.module';
import { DomainCheckMiddleware } from './web/middleware/domain.check.middleware';
import { AuthModule } from './web/auth/module/auth.module';
import { NotificationModule } from './email-notification/notification.module';
import { UserModule } from './web/user/module/user.module';
import { PinModule } from './web/pin/module/pin.module';
import { ReviewModule } from './web/review/module/review.module';
import { ConfigModule } from '@nestjs/config';
import { BookingModule } from './web/booking/module/booking.module';
import { PaymentModule } from './payment/module/payment.module';
import { WalletModule } from './web/wallet/module/wallet.module';
import { DriverModule } from './web/drivers/module/driver.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ormconfig,
    }),
    LoggerModule,
    NotificationModule,
    UserModule,
    BookingModule,
    ReviewModule,
    PinModule,
    PaymentModule,
    AuthModule,
    WalletModule,
    DriverModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DomainCheckMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
