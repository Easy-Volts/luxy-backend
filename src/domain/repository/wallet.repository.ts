import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.model';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async saveWallet(wallet: Wallet): Promise<Wallet> {
    return this.walletRepository.save(wallet);
  }

  async findByUserId(userId: number): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { userId } });
  }

  async findById(id: number): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { id } });
  }
} 