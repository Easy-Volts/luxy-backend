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

  async findByCustomerId(customerId: number): Promise<CarLending[]> {
    return this.bookingRepository.find({
      where: { customerId },
      relations: ['customer', 'car', 'car.brand'],
      order: { createdAt: 'DESC' },
    });
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
}
