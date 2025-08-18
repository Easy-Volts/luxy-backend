import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from 'src/domain/repository/notification.repository';
import { ApiResponseBuilder, ApiResponses } from 'src/dtos/response';
import { ListNotificationsQueryDto } from 'src/dtos/notification.query.dto';
import { CreateNotificationDto } from 'src/dtos/create.notification.dto';
import { NotificationService } from '../interface/notification.service';

@Injectable()
export class NotificationServiceImpl implements NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async list(
    userContext: { id: number },
    query: ListNotificationsQueryDto,
  ): Promise<ApiResponses<any>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const read =
      typeof query.read === 'string'
        ? query.read === 'true'
          ? true
          : query.read === 'false'
            ? false
            : undefined
        : undefined;

    const result = await this.notificationRepo.findPagedByUser(
      userContext.id,
      page,
      limit,
      {
        read,
        type: query.type,
      },
    );

    return new ApiResponseBuilder()
      .setMessage('Notifications fetched successfully')
      .setData(result)
      .build();
  }

  async markRead(
    userContext: { id: number },
    id: number,
  ): Promise<ApiResponses<any>> {
    const n = await this.notificationRepo.findOneByIdForUser(
      id,
      userContext.id,
    );
    if (!n) throw new NotFoundException('Notification not found');

    n.read = true;
    n.readAt = new Date();
    await this.notificationRepo.save(n);

    return new ApiResponseBuilder()
      .setMessage('Notification marked as read')
      .setData({ id: n.id, read: n.read, readAt: n.readAt })
      .build();
  }

  async markAllRead(userContext: { id: number }): Promise<ApiResponses<any>> {
    const affected = await this.notificationRepo.markAllRead(userContext.id);
    return new ApiResponseBuilder()
      .setMessage('All notifications marked as read')
      .setData({ affected })
      .build();
  }

  async delete(
    userContext: { id: number },
    id: number,
  ): Promise<ApiResponses<any>> {
    const ok = await this.notificationRepo.deleteOne(id, userContext.id);
    if (!ok) throw new NotFoundException('Notification not found');
    return new ApiResponseBuilder()
      .setMessage('Notification deleted')
      .setData({ id })
      .build();
  }

  async unreadCount(userContext: { id: number }): Promise<ApiResponses<any>> {
    const count = await this.notificationRepo.countUnread(userContext.id);
    return new ApiResponseBuilder()
      .setMessage('Unread count fetched')
      .setData({ count })
      .build();
  }

  async create(dto: CreateNotificationDto): Promise<ApiResponses<any>> {
    const entity = this.notificationRepo.create({
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      body: dto.body,
      icon: dto.icon,
      meta: dto.meta,
      read: false,
    });
    const saved = await this.notificationRepo.save(entity);
    return new ApiResponseBuilder()
      .setMessage('Notification created')
      .setData(saved)
      .build();
  }
}
