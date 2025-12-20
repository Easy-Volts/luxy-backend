// src/domain/repository/driver.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Driver } from '../entities/driver.model';
import { DriverQueryDto } from 'src/dtos/driver.query.dto';

@Injectable()
export class DriverRepository extends Repository<Driver> {
  constructor(private dataSource: DataSource) {
    super(Driver, dataSource.createEntityManager());
  }

  async findOneById(id: number): Promise<Driver | null> {
    return this.findOne({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Driver | null> {
    return this.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async saveDriver(driver: Driver): Promise<Driver> {
    return this.save(driver);
  }

  async findAllWithPagination(
    queryDto: DriverQueryDto,
  ): Promise<[Driver[], number]> {
    const queryBuilder = this.createQueryBuilder('driver')
      .leftJoinAndSelect('driver.user', 'user', 'driver.userId = user.id')
      .select([
        'driver.id',
        'driver.bvn',
        'driver.idType',
        'driver.idNumber',
        'driver.idImageUrl',
        'driver.kycVerified',
        'driver.userId',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.phone',
        'user.imageUrl',
        'user.city',
        'user.state',
        'user.country',
        'user.status',
        'user.dateCreated',
        'user.lastUpdated',
      ]);

    // Apply filters
    if (queryDto.kycVerified !== undefined) {
      queryBuilder.andWhere('driver.kycVerified = :kycVerified', {
        kycVerified: queryDto.kycVerified,
      });
    }

    if (queryDto.status) {
      queryBuilder.andWhere('user.status = :status', {
        status: queryDto.status,
      });
    }

    if (queryDto.city) {
      queryBuilder.andWhere('LOWER(user.city) LIKE LOWER(:city)', {
        city: `%${queryDto.city}%`,
      });
    }

    if (queryDto.country) {
      queryBuilder.andWhere('LOWER(user.country) LIKE LOWER(:country)', {
        country: `%${queryDto.country}%`,
      });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        {
          search: `%${queryDto.search}%`,
        },
      );
    }

    // Apply sorting
    const sortField =
      queryDto.sortBy === 'name'
        ? 'user.firstName'
        : queryDto.sortBy === 'rating'
          ? 'user.dateCreated' // We'll handle rating separately in service
          : 'user.dateCreated';
    const sortOrder = queryDto.sortOrder || 'DESC';
    queryBuilder.orderBy(sortField, sortOrder);

    // Apply pagination
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    return queryBuilder.getManyAndCount();
  }
}
