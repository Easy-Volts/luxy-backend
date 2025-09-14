import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { UpdateProfileDto } from '../../../dtos/update.profile.dto';
import {
  DeactivateAccountDto,
  ActivateAccountDto,
} from '../../../dtos/account.status.dto';
import { ApiResponses } from 'src/dtos/response';

export interface UserService {
  updateUserLocation(
    userContext: { id: number },
    dto: UpdateLocationDto,
  ): Promise<ApiResponses<any>>;

  updateUserProfile(
    userContext: { id: number },
    dto: UpdateProfileDto,
  ): Promise<ApiResponses<any>>;

  deactivateAccount(
    userContext: { id: number },
    dto: DeactivateAccountDto,
  ): Promise<ApiResponses<any>>;

  activateAccount(
    userContext: { id: number },
    dto: ActivateAccountDto,
  ): Promise<ApiResponses<any>>;

  getAccountStatus(userContext: { id: number }): Promise<ApiResponses<any>>;
}

export const USER_SERVICE = 'USER_SERVICE';
