import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.model';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(booking: Partial<Booking>): Promise<Booking> {
    const newBooking = this.bookingRepository.create(booking);
    return await this.bookingRepository.save(newBooking);
  }

  async findById(id: number): Promise<Booking | null> {
    return await this.bookingRepository.findOne({
      where: { id },
      relations: ['car', 'car.brand', 'customer', 'user'],
    });
  }

  async findByBookingReference(
    bookingReference: string,
  ): Promise<Booking | null> {
    return await this.bookingRepository.findOne({
      where: { bookingReference },
      relations: ['car', 'car.brand', 'customer', 'user'],
    });
  }

  async findByCustomerId(
    customerId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
    paymentStatus?: string,
  ): Promise<{ bookings: Booking[]; total: number }> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.car', 'car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.customerId = :customerId', { customerId });

    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (paymentStatus) {
      queryBuilder.andWhere('booking.paymentStatus = :paymentStatus', {
        paymentStatus,
      });
    }

    queryBuilder
      .orderBy('booking.dateCreated', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [bookings, total] = await queryBuilder.getManyAndCount();

    return { bookings, total };
  }

  async findByUserId(
    userId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
    paymentStatus?: string,
  ): Promise<{ bookings: Booking[]; total: number }> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.car', 'car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.userId = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (paymentStatus) {
      queryBuilder.andWhere('booking.paymentStatus = :paymentStatus', { paymentStatus });
    }

    queryBuilder
      .orderBy('booking.dateCreated', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [bookings, total] = await queryBuilder.getManyAndCount();

    return { bookings, total };
  }

  async checkCarAvailability(
    carId: number,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: number,
  ): Promise<boolean> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.carId = :carId', { carId })
      .andWhere('booking.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: ['CANCELLED', 'COMPLETED'],
      })
      .andWhere(
        '(booking.startDate <= :endDate AND booking.endDate >= :startDate)',
        { startDate, endDate },
      );

    if (excludeBookingId) {
      queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflictingBooking = await queryBuilder.getOne();
    return !conflictingBooking;
  }

  async update(id: number, updateData: Partial<Booking>): Promise<Booking | null> {
    await this.bookingRepository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.bookingRepository.delete(id);
    return result.affected! > 0;
  }

  async generateBookingReference(): Promise<string> {
    const prefix = 'LX';
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}
