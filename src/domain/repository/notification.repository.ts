// src/domain/repository/notification.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Notification } from '../entities/notification.model';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  async save(entity: Notification): Promise<Notification> {
    return this.repo.save(entity);
  }

  create(payload: Partial<Notification>): Notification {
    return this.repo.create(payload);
  }

  async findOneByIdForUser(
    id: number,
    userId: number,
  ): Promise<Notification | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  async findPagedByUser(
    userId: number,
    page = 1,
    limit = 20,
    filters?: { read?: boolean; type?: string },
  ) {
    const where: FindOptionsWhere<Notification> = { userId };
    if (typeof filters?.read === 'boolean') where.read = filters.read;
    if (filters?.type) (where as any).type = filters.type;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { dateCreated: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async markAllRead(userId: number): Promise<number> {
    const res = await this.repo.update(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );
    return res.affected ?? 0;
  }

  async deleteOne(id: number, userId: number): Promise<boolean> {
    const res = await this.repo.delete({ id, userId });
    return !!res.affected;
  }

  async countUnread(userId: number): Promise<number> {
    return this.repo.count({ where: { userId, read: false } });
  }
}
