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
  
  async findByWalletAccount(accountNumber: number): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { accountNumber } });
  }

  async updateWalletBalance(userId: number, amount: number): Promise<Wallet | null> {
    const wallet = await this.findByUserId(userId);
    if (!wallet) {
      return null;
    }
    
    wallet.balance = Number(wallet.balance) + amount;
    wallet.updatedAt = new Date();
    
    return this.saveWallet(wallet);
  }

  async debitWallet(userId: number, amount: number): Promise<Wallet | null> {
    const wallet = await this.findByUserId(userId);
    if (!wallet) {
      return null;
    }
    
    if (Number(wallet.balance) < amount) {
      throw new Error('Insufficient wallet balance');
    }
    
    wallet.balance = Number(wallet.balance) - amount;
    wallet.updatedAt = new Date();
    
    return this.saveWallet(wallet);
  }

  async getWalletBalance(userId: number): Promise<number> {
    const wallet = await this.findByUserId(userId);
    return wallet ? Number(wallet.balance) : 0;
  }

  async createWalletIfNotExists(userId: number): Promise<Wallet> {
    let wallet = await this.findByUserId(userId);
    
    if (!wallet) {
      wallet = new Wallet();
      wallet.userId = userId;
      wallet.balance = 0;
      wallet.currency = 'NGN';
      wallet.status = 'ACTIVE';
      wallet.createdAt = new Date();
      wallet.updatedAt = new Date();
      
      wallet = await this.saveWallet(wallet);
    }
    
    return wallet;
  }
}
