// src/domain/repository/driver.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Driver } from '../entities/driver.model';

@Injectable()
export class DriverRepository extends Repository<Driver> {
  constructor(private dataSource: DataSource) {
    super(Driver, dataSource.createEntityManager());
  }

  async findOneById(id: number): Promise<Driver | null> {
    return this.findOne({ where: { id } });
  }

  async saveDriver(driver: Driver): Promise<Driver> {
    return this.save(driver);
  }
}
