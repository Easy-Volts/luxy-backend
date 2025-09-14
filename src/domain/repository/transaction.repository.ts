import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.model';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async savetransaction(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

  async findByUserId(userId: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { userId } });
  }
  async findByReference(reefrence: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { reefrence } });
  }

  async findById(id: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { id } });
  }
}
