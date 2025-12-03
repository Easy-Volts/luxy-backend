import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.model';

@Entity({ name: 'driver' })
export class Driver {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;
  @Column({ type: 'text', nullable: true })
  bvn?: string;
  @Column({ type: 'text', nullable: true })
  idType?: string;
  @Column({ type: 'text', nullable: true })
  idNumber?: string;
  @Column({ type: 'text', nullable: true })
  idImageUrl?: string;
  @Column({ default: false })
  kycVerified?: boolean;
  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user?: Users;
}
