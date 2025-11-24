/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CarLending } from '../entities/car.lending.model';
import { BookingStatus } from 'src/enums/user.enum';

@Injectable()
export class CarLendingRepository {
  constructor(
    @InjectRepository(CarLending)
    private bookingRepository: Repository<CarLending>,
  ) {}

  async saveBooking(booking: CarLending): Promise<CarLending> {
    return this.bookingRepository.save(booking);
  }

  async findById(id: number): Promise<CarLending | null> {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['customer', 'car', 'car.brand'],
    });
  }

  async findByReference(reference: string): Promise<CarLending | null> {
    return this.bookingRepository.findOne({
      where: { bookingReference: reference },
      relations: ['customer', 'car', 'car.brand'],
    });
  }

  async findByCode(bookingCode: string): Promise<CarLending | null> {
    return this.bookingRepository.findOne({
      where: { bookingCode: bookingCode },
      relations: ['customer', 'car', 'car.brand'],
    });
  }

  async findByCustomerId(customerId: number): Promise<CarLending[]> {
    return this.bookingRepository.find({
      where: { customerId },
      relations: ['customer', 'car', 'car.brand'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomerIdWithPagination(
    customerId: number,
    options: {
      status?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<[CarLending[], number]> {
    const where: any = { customerId };
    if (options.status) {
      where.status = options.status;
    }

    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    return this.bookingRepository.findAndCount({
      where,
      relations: ['customer', 'car', 'car.brand'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async findByDriverIdWithPagination(
    driverId: number,
    options: {
      status?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<[CarLending[], number]> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.car', 'car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.vendor', 'vendor')
      .where('vendor.userId = :driverId', { driverId });

    if (options.status) {
      queryBuilder.andWhere('booking.status = :status', {
        status: options.status,
      });
    }

    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    queryBuilder.orderBy('booking.createdAt', 'DESC').skip(skip).take(limit);

    return queryBuilder.getManyAndCount();
  }

  async findByCarId(carId: number): Promise<CarLending[]> {
    return this.bookingRepository.find({
      where: { carId },
      relations: ['customer', 'car', 'car.brand'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveBookings(): Promise<CarLending[]> {
    return this.bookingRepository.find({
      where: {
        status: BookingStatus.ACTIVE,
      },
      relations: ['customer', 'car', 'car.brand'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBookingsByDateRange(
    carId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CarLending[]> {
    return this.bookingRepository.find({
      where: [
        {
          carId,
          startDate: Between(startDate, endDate),
          status: BookingStatus.CONFIRMED,
        },
        {
          carId,
          endDate: Between(startDate, endDate),
          status: BookingStatus.CONFIRMED,
        },
        {
          carId,
          startDate: Between(startDate, endDate),
          status: BookingStatus.ACTIVE,
        },
        {
          carId,
          endDate: Between(startDate, endDate),
          status: BookingStatus.ACTIVE,
        },
      ],
    });
  }

  async findAll(): Promise<CarLending[]> {
    return this.bookingRepository.find({
      relations: ['customer', 'car', 'car.brand'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateBookingStatus(
    id: number,
    status: BookingStatus,
  ): Promise<CarLending | null> {
    const booking = await this.findById(id);
    if (!booking) return null;

    booking.status = status;

    if (status === BookingStatus.CONFIRMED) {
      booking.confirmedAt = new Date();
    } else if (status === BookingStatus.CANCELLED) {
      booking.cancelledAt = new Date();
    } else if (status === BookingStatus.COMPLETED) {
      booking.completedAt = new Date();
    }

    return this.saveBooking(booking);
  }

  async countByDriverId(driverId: number): Promise<number> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.car', 'car')
      .leftJoin('car.vendor', 'vendor')
      .where('vendor.userId = :driverId', { driverId })
      .getCount();
  }

  async findRecentByDriverId(driverId: number): Promise<CarLending | null> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.car', 'car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.vendor', 'vendor')
      .where('vendor.userId = :driverId', { driverId })
      .orderBy('booking.createdAt', 'DESC')
      .limit(1)
      .getOne();
  }
}
