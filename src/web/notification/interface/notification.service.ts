import { ApiResponses } from 'src/dtos/response';
import { ListNotificationsQueryDto } from 'src/dtos/notification.query.dto';
import { CreateNotificationDto } from 'src/dtos/create.notification.dto';

export interface NotificationService {
  list(
    userContext: { id: number },
    query: ListNotificationsQueryDto,
  ): Promise<ApiResponses<any>>;
  markRead(userContext: { id: number }, id: number): Promise<ApiResponses<any>>;
  markAllRead(userContext: { id: number }): Promise<ApiResponses<any>>;
  delete(userContext: { id: number }, id: number): Promise<ApiResponses<any>>;
  unreadCount(userContext: { id: number }): Promise<ApiResponses<any>>;
  create(dto: CreateNotificationDto): Promise<ApiResponses<any>>; // admin/internal
}

export const NOTIFICATION_SERVICE = 'NOTIFICATION_SERVICE';
