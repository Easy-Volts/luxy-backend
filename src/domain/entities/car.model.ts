import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.model';

@Entity({ name: 'car' })
export class Car {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'varchar', length: 100 })
  make!: string;

  @Column({ type: 'varchar', length: 100 })
  model!: string;

  @Column({ type: 'int' })
  year!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  licensePlate?: string;

  @Column({ type: 'bigint' })
  customerId!: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer?: Customer;
}
