import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { UpdateProfileDto } from '../../../dtos/update.profile.dto';
import { ApiResponses } from 'src/dtos/response';

export interface UserService {
  updateUserLocation(
    userId: number,
    dto: UpdateLocationDto,
  ): Promise<ApiResponses<any>>;
  updateUserProfile(
    userContext: { id: number },
    dto: UpdateProfileDto,
  ): Promise<ApiResponses<any>>;
}

export const USER_SERVICE = 'USER_SERVICE';
