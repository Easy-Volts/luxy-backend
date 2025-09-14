import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../entities/driver.model';

@Injectable()
export class DriverRepository {
  constructor(
    @InjectRepository(Driver)
    private DriverRepository: Repository<Driver>,
  ) {}

  async saveDriver(Driver: Driver): Promise<Driver> {
    return this.DriverRepository.save(Driver);
  }

  async findOneByUserId(userId: number): Promise<Driver | null> {
    return this.DriverRepository.findOne({ where: { userId } });
  }

  async findAll(): Promise<Driver[]> {
    return this.DriverRepository.find();
  }

  async findOneById(id: number): Promise<Driver | null> {
    return this.DriverRepository.findOne({ where: { id } });
  }
}
