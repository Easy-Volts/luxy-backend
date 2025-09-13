import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './user.model';

@Entity({ name: 'pins' })
export class Pin {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Users;

  @Column({ type: 'bigint' })
  userId!: number;

  @Column({ type: 'text' })
  hashedPin!: string;

  @Column({ default: false })
  isResetRequired!: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
