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
import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from 'src/enums/user.enum';

@Entity({ name: 'car_booking' })
export class CarLending {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  bookingReference!: string;

  @Column({ type: 'bigint' })
  customerId!: number;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @Column({ type: 'bigint' })
  carId!: number;

  @ManyToOne(() => Car, { eager: true })
  @JoinColumn({ name: 'carId' })
  car!: Car;

  @Column({ type: 'datetime' })
  startDate!: Date;

  @Column({ type: 'datetime' })
  endDate!: Date;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({ type: 'int' })
  totalDays!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerDay!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxAmount?: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status!: BookingStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus!: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod?: PaymentMethod;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentReference?: string;

  @Column({ type: 'text', nullable: true })
  specialRequests?: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'datetime', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pickupLocation?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  returnLocation?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
