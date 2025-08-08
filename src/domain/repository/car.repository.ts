import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../entities/car.model';

@Injectable()
export class CarRepository {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  async findById(id: number): Promise<Car | null> {
    return this.carRepository.findOne({
      where: { id },
      relations: ['brand', 'vendor'],
    });
  }

  async findByVendorId(vendorId: number): Promise<Car[]> {
    return this.carRepository.find({
      where: { vendorId },
      relations: ['brand', 'vendor'],
    });
  }

  async findAvailableCars(): Promise<Car[]> {
    return this.carRepository.find({
      where: { status: 'AVAILABLE' },
      relations: ['brand', 'vendor'],
    });
  }

  async findAll(): Promise<Car[]> {
    return this.carRepository.find({
      relations: ['brand', 'vendor'],
    });
  }

  async saveCar(car: Car): Promise<Car> {
    return this.carRepository.save(car);
  }
}
