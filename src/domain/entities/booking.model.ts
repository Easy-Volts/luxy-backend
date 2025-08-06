import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Car } from './car.model';
import { Customer } from './customer.model';
import { Users } from './user.model';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity({ name: 'booking' })
export class Booking {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  bookingReference!: string;

  @Column({ type: 'bigint' })
  customerId!: number;
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @Column({ type: 'bigint' })
  userId!: number;
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user!: Users;

  @Column({ type: 'bigint' })
  carId!: number;
  @ManyToOne(() => Car)
  @JoinColumn({ name: 'carId' })
  car!: Car;

  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({ type: 'int' })
  numberOfDays!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerDay!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxAmount?: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status?: BookingStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus?: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pickupLocation?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dropoffLocation?: string;

  @Column({ type: 'text', nullable: true })
  specialRequests?: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  lastUpdated?: Date;
}
