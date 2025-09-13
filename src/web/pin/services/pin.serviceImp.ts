import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PinRepository } from '../../../domain/repository/pin.repository';
import { CreatePinDto } from '../../../dtos/create-pin.dto';
import { VerifyPinDto } from '../../../dtos/verify-pin.dto';
import { ResetPinDto } from '../../../dtos/reset-pin.dto';
import { PinService } from '../interface/pin.service';
import { ApiResponses, ApiResponseBuilder } from 'src/dtos/response';
import { Pin } from '../../../domain/entities/pin.model';
import { Users } from '../../../domain/entities/user.model';

@Injectable()
export class PinServiceImpl implements PinService {
  constructor(private readonly pinRepository: PinRepository) {}

  async createPin(
    userContext: { id: number },
    dto: CreatePinDto,
  ): Promise<ApiResponses<any>> {
    const existing = await this.pinRepository.findByUserId(userContext.id);
    if (existing) throw new BadRequestException('PIN already exists');

    const hashedPin = await bcrypt.hash(dto.pin, 10);

    const pin: Partial<Pin> = {
      user: Object.assign(new Users(), { id: userContext.id }), // ✅ safe type
      hashedPin,
      isResetRequired: false,
    };

    await this.pinRepository.savePin(pin);

    return new ApiResponseBuilder()
      .setMessage('PIN created successfully')
      .build();
  }

  async verifyPin(
    userContext: { id: number },
    dto: VerifyPinDto,
  ): Promise<ApiResponses<any>> {
    const pin = await this.pinRepository.findByUserId(userContext.id);
    if (!pin) throw new NotFoundException('No PIN found for this user');

    const isMatch = await bcrypt.compare(dto.pin, pin.hashedPin);
    if (!isMatch) throw new BadRequestException('Invalid PIN');

    return new ApiResponseBuilder()
      .setMessage('PIN verified successfully')
      .build();
  }

  async resetPin(
    userContext: { id: number },
    dto: ResetPinDto,
  ): Promise<ApiResponses<any>> {
    const pin = await this.pinRepository.findByUserId(userContext.id);
    if (!pin) throw new NotFoundException('No PIN found for this user');

    pin.hashedPin = await bcrypt.hash(dto.newPin, 10);
    pin.isResetRequired = false;
    pin.user = Object.assign(new Users(), { id: userContext.id }); // ✅ safe type

    await this.pinRepository.savePin(pin);

    return new ApiResponseBuilder()
      .setMessage('PIN reset successfully')
      .build();
  }
}
