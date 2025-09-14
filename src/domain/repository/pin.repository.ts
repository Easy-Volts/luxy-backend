// ==================== REPOSITORY ====================

// src/domain/repositories/pin.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from '../entities/pin.model';

@Injectable()
export class PinRepository {
  constructor(
    @InjectRepository(Pin)
    private readonly pinRepo: Repository<Pin>,
  ) {}

  async create(pinData: Partial<Pin>): Promise<Pin> {
    const pin = this.pinRepo.create(pinData);
    return this.pinRepo.save(pin);
  }

  async save(pin: Pin): Promise<Pin> {
    return this.pinRepo.save(pin);
  }

  async findByUserId(userId: number): Promise<Pin | null> {
    return this.pinRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async findByUserIdWithoutRelations(userId: number): Promise<Pin | null> {
    return this.pinRepo.findOne({
      where: { userId },
    });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.pinRepo.delete({ userId });
  }

  async deleteById(id: number): Promise<void> {
    await this.pinRepo.delete(id);
  }

  async updateAttemptCount(userId: number, count: number): Promise<void> {
    await this.pinRepo.update(
      { userId },
      {
        attemptCount: count,
        lastAttemptAt: new Date(),
      },
    );
  }

  async resetAttemptCount(userId: number): Promise<void> {
    await this.pinRepo.update(
      { userId },
      {
        attemptCount: 0,
        lastAttemptAt: null,
      },
    );
  }
}
