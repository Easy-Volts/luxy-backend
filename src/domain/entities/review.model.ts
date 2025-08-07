import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.model';
import { Car } from './car.model';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'int', nullable: false })
  rating!: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'bigint', nullable: false })
  reviewerId!: number; // User who is giving the review

  @Column({ type: 'bigint', nullable: false })
  revieweeId!: number; // User being reviewed (car owner/renter)

  @Column({ type: 'bigint', nullable: true })
  carId?: number; // Car being reviewed (optional)

  @Column({ type: 'varchar', length: 50, nullable: false })
  reviewType!: string; // 'CAR_OWNER', 'RENTER', 'CAR'

  @Column({ type: 'bigint', nullable: true })
  bookingId?: number; // Associated booking/lending

  @Column({ default: true })
  isActive?: boolean;

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  lastUpdated?: Date;

  // Relationships
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'reviewerId' })
  reviewer?: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'revieweeId' })
  reviewee?: Users;

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'carId' })
  car?: Car;
}
