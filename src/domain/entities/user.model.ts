import { CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';
import { UserType, UserStatus } from 'src/enums/user.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column()
  lastName?: string;

  @Column({ nullable: true })
  @Index()
  email?: string;
  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'text', nullable: true })
  otpCode: string | undefined;

  @Column({ type: 'timestamp', nullable: true })
  otpGeneratedAt?: Date | undefined;

  @Column({ default: false })
  otpVerified?: boolean;

  @Column({ nullable: true })
  _address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Column({ type: 'float', nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  password?: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status?: UserStatus;

  @Column({ type: 'enum', enum: UserType, default: UserType.CUSTOMER })
  userType?: UserType;

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  lastUpdated?: Date;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true })
  referralCode?: string;

  @Column({ nullable: true })
  referredBy?: string;

  @Column({ default: false })
  locationVerified?: boolean;

  @Column({ default: false })
  phoneVerified?: boolean;

  @Column({ nullable: true })
  deviceId?: string;

  @Column({ nullable: true })
  deviceToken?: string;
}
