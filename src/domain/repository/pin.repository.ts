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

  async savePin(pin: Partial<Pin>): Promise<Pin> {
    return this.pinRepo.save(pin);
  }

  async findByUserId(userId: number): Promise<Pin | null> {
    return this.pinRepo.findOne({ where: { userId } });
  }

  async deletePin(id: number): Promise<void> {
    await this.pinRepo.delete(id);
  }
}
