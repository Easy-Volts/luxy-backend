import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.model';

@Injectable()
export class VendorRepository {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async saveVendor(customer: Vendor): Promise<Vendor> {
    return this.vendorRepository.save(customer);
  }

  async findOneByUserId(userId: number): Promise<Vendor | null> {
    return this.vendorRepository.findOne({ where: { userId } });
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.find();
  }

  async findOneById(id: number): Promise<Vendor | null> {
    return this.vendorRepository.findOne({ where: { id } });
  }
}
