import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vendor' })
export class Vendor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;
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
}
