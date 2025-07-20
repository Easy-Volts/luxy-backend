import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.model';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async saveCustomer(customer: Customer): Promise<Customer> {
    return this.customerRepository.save(customer);
  }

  async findOneByUserId(userId: number): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { userId } });
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOneById(id: number): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { id } });
  }
}
