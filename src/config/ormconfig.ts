import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { Customer } from 'src/domain/entities/customer.model';
import { Users } from 'src/domain/entities/user.model';
import { Wallet } from 'src/domain/entities/wallet.model';
import { Review } from 'src/domain/entities/review.model';
import { Car } from 'src/domain/entities/car.model';
import { Brand } from 'src/domain/entities/brand.model';
import { Vendor } from 'src/domain/entities/vendor.model';
import { CarLending } from 'src/domain/entities/car.lending.model';
import { Transaction } from 'src/domain/entities/transaction.model';
import { Driver } from 'src/domain/entities/driver.model';
import { Pin } from 'src/domain/entities/pin.model';

dotenv.config();

export const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: true,
  entities: [
    Users,
    Customer,
    Wallet,
    Review,
    Car,
    Brand,
    Vendor,
    CarLending,
    Transaction,
    Driver,
    Pin,
  ],
};
