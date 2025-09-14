import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PinRepository } from '../../../domain/repository/pin.repository';
import { CreatePinDto } from '../../../dtos/create-pin.dto';
import { VerifyPinDto } from '../../../dtos/verify-pin.dto';
import { ResetPinDto } from '../../../dtos/reset-pin.dto';
import { PinService } from '../interface/pin.service';
import { ApiResponses, ApiResponseBuilder } from '../../../dtos/response';
import { Pin } from '../../../domain/entities/pin.model';

@Injectable()
export class PinServiceImpl implements PinService {
  private readonly logger = new Logger(PinServiceImpl.name);
  private readonly MAX_ATTEMPTS = 3;
  private readonly SALT_ROUNDS = 12;

  constructor(private readonly pinRepository: PinRepository) {}

  // ==================== CREATE PIN ====================
  async createPin(
    userContext: { userId: number },
    dto: CreatePinDto,
  ): Promise<ApiResponses<any>> {
    try {
      this.logger.log(`Creating PIN for user ${userContext.userId}`);

      // Check if PIN already exists
      const existingPin = await this.pinRepository.findByUserIdWithoutRelations(
        userContext.userId,
      );

      if (existingPin) {
        throw new BadRequestException('PIN already exists for this user');
      }

      // Hash the PIN
      const hashedPin = await bcrypt.hash(dto.pin, this.SALT_ROUNDS);

      // Create PIN entity
      const pinData: Partial<Pin> = {
        userId: userContext.userId,
        hashedPin,
        isResetRequired: false,
        attemptCount: 0,
        lastAttemptAt: null,
      };

      await this.pinRepository.create(pinData);

      this.logger.log(
        `PIN created successfully for user ${userContext.userId}`,
      );

      return new ApiResponseBuilder()
        .setMessage('PIN created successfully')
        .setData({ created: true })
        .build();
    } catch (error) {
      this.logger.error(
        `Error creating PIN for user ${userContext.userId}:`,
        error,
      );
      throw error;
    }
  }

  // ==================== VERIFY PIN ====================
  async verifyPin(
    userContext: { userId: number },
    dto: VerifyPinDto,
  ): Promise<ApiResponses<any>> {
    try {
      this.logger.log(`Verifying PIN for user ${userContext.userId}`);

      const pin = await this.pinRepository.findByUserIdWithoutRelations(
        userContext.userId,
      );

      if (!pin) {
        throw new NotFoundException('No PIN found for this user');
      }

      // Check if account is locked due to too many attempts
      if (pin.attemptCount >= this.MAX_ATTEMPTS) {
        const lockoutTime = 15 * 60 * 1000; // 15 minutes
        const timeSinceLastAttempt = pin.lastAttemptAt
          ? Date.now() - pin.lastAttemptAt.getTime()
          : lockoutTime + 1;

        if (timeSinceLastAttempt < lockoutTime) {
          throw new UnauthorizedException(
            `PIN verification locked. Try again in ${Math.ceil(
              (lockoutTime - timeSinceLastAttempt) / 60000,
            )} minutes`,
          );
        } else {
          // Reset attempt count after lockout period
          await this.pinRepository.resetAttemptCount(userContext.userId);
          pin.attemptCount = 0;
        }
      }

      // Verify PIN
      const isMatch = await bcrypt.compare(dto.pin, pin.hashedPin);

      if (!isMatch) {
        // Increment attempt count
        const newAttemptCount = pin.attemptCount + 1;
        await this.pinRepository.updateAttemptCount(
          userContext.userId,
          newAttemptCount,
        );

        const remainingAttempts = this.MAX_ATTEMPTS - newAttemptCount;

        if (remainingAttempts > 0) {
          throw new BadRequestException(
            `Invalid PIN. ${remainingAttempts} attempts remaining`,
          );
        } else {
          throw new UnauthorizedException(
            'Invalid PIN. Account locked for 15 minutes due to too many failed attempts',
          );
        }
      }

      // Reset attempt count on successful verification
      if (pin.attemptCount > 0) {
        await this.pinRepository.resetAttemptCount(userContext.userId);
      }

      this.logger.log(
        `PIN verified successfully for user ${userContext.userId}`,
      );

      return new ApiResponseBuilder()
        .setMessage('PIN verified successfully')
        .setData({ verified: true })
        .build();
    } catch (error) {
      this.logger.error(
        `Error verifying PIN for user ${userContext.userId}:`,
        error,
      );
      throw error;
    }
  }

  // ==================== RESET PIN ====================
  async resetPin(
    userContext: { userId: number },
    dto: ResetPinDto,
  ): Promise<ApiResponses<any>> {
    try {
      this.logger.log(`Resetting PIN for user ${userContext.userId}`);

      const pin = await this.pinRepository.findByUserIdWithoutRelations(
        userContext.userId,
      );

      if (!pin) {
        throw new NotFoundException('No PIN found for this user');
      }

      // Hash the new PIN
      const hashedPin = await bcrypt.hash(dto.newPin, this.SALT_ROUNDS);

      // Update PIN
      pin.hashedPin = hashedPin;
      pin.isResetRequired = false;
      pin.attemptCount = 0;
      pin.lastAttemptAt = null;

      await this.pinRepository.save(pin);

      this.logger.log(`PIN reset successfully for user ${userContext.userId}`);

      return new ApiResponseBuilder()
        .setMessage('PIN reset successfully')
        .setData({ reset: true })
        .build();
    } catch (error) {
      this.logger.error(
        `Error resetting PIN for user ${userContext.userId}:`,
        error,
      );
      throw error;
    }
  }

  // ==================== DELETE PIN ====================
  async deletePin(userContext: { userId: number }): Promise<ApiResponses<any>> {
    try {
      this.logger.log(`Deleting PIN for user ${userContext.userId}`);

      const pin = await this.pinRepository.findByUserIdWithoutRelations(
        userContext.userId,
      );

      if (!pin) {
        throw new NotFoundException('No PIN found for this user');
      }

      await this.pinRepository.deleteByUserId(userContext.userId);

      this.logger.log(
        `PIN deleted successfully for user ${userContext.userId}`,
      );

      return new ApiResponseBuilder()
        .setMessage('PIN deleted successfully')
        .setData({ deleted: true })
        .build();
    } catch (error) {
      this.logger.error(
        `Error deleting PIN for user ${userContext.userId}:`,
        error,
      );
      throw error;
    }
  }

  // ==================== CHECK PIN EXISTS ====================
  async checkPinExists(userContext: {
    userId: number;
  }): Promise<ApiResponses<{ exists: boolean }>> {
    try {
      const pin = await this.pinRepository.findByUserIdWithoutRelations(
        userContext.userId,
      );

      return new ApiResponseBuilder<{ exists: boolean }>()
        .setMessage('PIN status retrieved successfully')
        .setData({ exists: !!pin })
        .build();
    } catch (error) {
      this.logger.error(
        `Error checking PIN existence for user ${userContext.userId}:`,
        error,
      );
      throw error;
    }
  }
}
