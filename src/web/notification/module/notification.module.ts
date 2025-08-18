import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/domain/entities/notification.model';
import { NotificationRepository } from 'src/domain/repository/notification.repository';
import { NotificationController } from '../controllers/notification.controller';
import { NOTIFICATION_SERVICE } from '../interface/notification.service';
import { NotificationServiceImpl } from '../services/notification.serviceImp';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { AuthGuard } from 'src/commons/security/guard';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [
    NotificationRepository,
    { provide: NOTIFICATION_SERVICE, useClass: NotificationServiceImpl },
    RolesGuard,
    AuthGuard,
  ],
})
export class NotificationsModule {}
