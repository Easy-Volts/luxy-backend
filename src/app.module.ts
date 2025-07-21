import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './config/ormconfig';
import { LoggerModule } from './log/logger.module';
import { DomainCheckMiddleware } from './web/middleware/domain.check.middleware';
import { NotificationModule } from './email-notification/notification.module';
import { UserModule } from './web/user/module/user.module';
import { ConfigModule } from '@nestjs/config';

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
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DomainCheckMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
