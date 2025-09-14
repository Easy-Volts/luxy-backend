import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../../../shared/shared.module';
import { Pin } from '../../../domain/entities/pin.model';
import { PinRepository } from '../../../domain/repository/pin.repository';
import { PinController } from '../controllers/pin.controller';
import { PIN_SERVICE } from '../interface/pin.service';
import { PinServiceImpl } from '../services/pin.serviceImp';

@Module({
  imports: [TypeOrmModule.forFeature([Pin]), SharedModule],
  controllers: [PinController],
  providers: [
    PinRepository,
    {
      provide: PIN_SERVICE,
      useClass: PinServiceImpl,
    },
  ],
  exports: [PinRepository, PIN_SERVICE],
})
export class PinModule {}
