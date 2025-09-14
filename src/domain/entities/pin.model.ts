import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../entities/user.model';

@Entity({ name: 'pins' })
export class Pin {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'userId', type: 'bigint' })
  userId!: number;

  @ManyToOne(() => Users, (user) => user.pins, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user!: Users;

  @Column({ type: 'text' })
  hashedPin!: string;

  @Column({ default: false })
  isResetRequired!: boolean;

  @Column({ default: 0 })
  attemptCount!: number;

  @Column({ type: 'timestamp', nullable: true })
  lastAttemptAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
