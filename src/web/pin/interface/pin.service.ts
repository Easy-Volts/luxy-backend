import { CreatePinDto } from '../../../dtos/create-pin.dto';
import { VerifyPinDto } from '../../../dtos/verify-pin.dto';
import { ResetPinDto } from '../../../dtos/reset-pin.dto';
import { ApiResponses } from 'src/dtos/response';

export interface PinService {
  createPin(
    userContext: { id: number },
    dto: CreatePinDto,
  ): Promise<ApiResponses<any>>;
  verifyPin(
    userContext: { id: number },
    dto: VerifyPinDto,
  ): Promise<ApiResponses<any>>;
  resetPin(
    userContext: { id: number },
    dto: ResetPinDto,
  ): Promise<ApiResponses<any>>;
}

export const PIN_SERVICE = 'PIN_SERVICE';
