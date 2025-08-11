// src/modules/user/interface/user.service.ts
import { ApiResponses } from 'src/dtos/response';
import { UpdateLocationDto } from 'src/dtos/update.location.dto';
import { UpdateProfileDto } from 'src/dtos/update.profile.dto';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface UserService {
  updateUserLocation(
    userId: number,
    dto: UpdateLocationDto,
  ): Promise<ApiResponses<any>>;

  updateUserProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<ApiResponses<any>>;
}
