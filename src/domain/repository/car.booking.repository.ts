import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CarBooking, BookingStatus } from '../entities/car.lending.model';

@Injectable()
export class CarBookingRepository {
  constructor(
    @InjectRepository(CarBooking)
    private bookingRepository: Repository<CarBooking>,
  ) {}

  async saveBooking(booking: CarBooking): Promise<CarBooking> {
    return this.bookingRepository.save(booking);
  }

  async findById(id: number): Promise<CarBooking | null> {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['customer', 'car', 'car.brand'],
    });
  }

  async findByReference(reference: string): Promise<CarBooking | null> {
    return this.bookingRepository.findOne({
      where: { bookingReference: reference },
      relations: ['customer', 'car', 'car.brand'],
    });
  }

  async findByCustomerId(customerId: number): Promise<CarBooking[]> {
    return this.bookingRepository.find({
      where: { customerId },
      relations: ['customer', 'car', 'car.brand'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCarId(carId: number): Promise<CarBooking[]> {
    return this.bookingRepository.find({
      where: { carId },
      relations: ['customer', 'car', 'car.brand'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveBookings(): Promise<CarBooking[]> {
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
  ): Promise<CarBooking[]> {
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

  async findAll(): Promise<CarBooking[]> {
    return this.bookingRepository.find({
      relations: ['customer', 'car', 'car.brand'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateBookingStatus(
    id: number,
    status: BookingStatus,
  ): Promise<CarBooking | null> {
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
