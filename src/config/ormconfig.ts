import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/domain/entities/customer.model';
import { Users } from 'src/domain/entities/user.model';
import { Wallet } from 'src/domain/entities/wallet.model';
import { Review } from 'src/domain/entities/review.model';
import { Car } from 'src/domain/entities/car.model';
import { Brand } from 'src/domain/entities/brand.model';
import { Vendor } from 'src/domain/entities/vendor.model';
import * as dotenv from 'dotenv';

dotenv.config();
export const ormconfig: TypeOrmModule = {
  type: process.env.DB_TYPE ?? 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME,
  entities: [Users, Customer, Wallet, Review, Car, Brand, Vendor],
  synchronize: true,
};
