import { PaymentMethod } from 'src/enums/user.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reefrence?: string;
  @Column({ type: 'varchar', length: 100, unique: true })
  code!: string;
  @Column({ type: 'varchar' })
  status!: string;
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  amount!: number;
  @Column({ type: 'bigint' })
  userId!: number;
  @Column({ type: 'enum', enum: PaymentMethod })
  paymentType?: PaymentMethod;

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  lastUpdated?: Date;
}
