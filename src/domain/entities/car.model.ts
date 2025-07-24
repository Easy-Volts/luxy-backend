import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vendor } from './vendor.model';

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

  @Column({ type: 'varchar', length: 17, nullable: true })
  vin?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  transmissionType?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  fuelType?: string;

  @Column({ default: false })
  hasEscort?: boolean;

  @Column({ type: 'text', nullable: true })
  conditionReport?: string;

  @Column({ type: 'json', nullable: true })
  features?: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  exteriorPhotoUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  interiorPhotoUrl?: string;

  @Column({ type: 'int', nullable: true })
  numberOfSeats?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  carLocation?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vehicleLicenseUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  roadworthinessUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ownershipCertificateUrl?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status?: string;

  @Column({ type: 'bigint' })
  vendorId!: number;
  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  lastUpdated?: Date;
}
