import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum NotificationType {
  RIDE_BOOKED = 'RIDE_BOOKED',
  INFO = 'INFO',
  PROMO = 'PROMO',
}

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Index()
  @Column({ type: 'bigint' })
  userId!: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type!: NotificationType;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon?: string;

  @Index()
  @Column({ default: false })
  read!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date | null;

  @Column({ type: 'json', nullable: true })
  meta?: Record<string, any>;

  @CreateDateColumn()
  dateCreated!: Date;

  @UpdateDateColumn()
  lastUpdated!: Date;
}
