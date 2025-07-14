import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './config/ormconfig';
import { LoggerModule } from './log/logger.module';
import { DomainCheckMiddleware } from './web/middleware/domain.check.middleware';
import { AuthModule } from './web/auth/module/auth.module';
import { NotificationModule } from './email-notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ormconfig,
    }),
    LoggerModule,
    AuthModule,
    NotificationModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DomainCheckMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
