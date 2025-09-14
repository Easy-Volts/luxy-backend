import { CreatePinDto } from '../../../dtos/create-pin.dto';
import { VerifyPinDto } from '../../../dtos/verify-pin.dto';
import { ResetPinDto } from '../../../dtos/reset-pin.dto';
import { ApiResponses } from '../../../dtos/response';

// ✅ Updated to use userId instead of id
export interface PinService {
  createPin(
    userContext: { userId: number },
    dto: CreatePinDto,
  ): Promise<ApiResponses<any>>;

  verifyPin(
    userContext: { userId: number },
    dto: VerifyPinDto,
  ): Promise<ApiResponses<any>>;

  resetPin(
    userContext: { userId: number },
    dto: ResetPinDto,
  ): Promise<ApiResponses<any>>;

  deletePin(userContext: { userId: number }): Promise<ApiResponses<any>>;

  checkPinExists(userContext: { userId: number }): Promise<ApiResponses<any>>;
}

export const PIN_SERVICE = 'PIN_SERVICE';
