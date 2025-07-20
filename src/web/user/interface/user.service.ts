import { ApiResponses } from 'src/dtos/response';
import { UpdateLocationDto } from '../../../dtos/update.location.dto';
export const USER_SERVICE = Symbol('USER_SERVICE');
export interface UserService {
  updateUserLocation(
    userId: number,
    dto: UpdateLocationDto,
  ): Promise<ApiResponses<any>>;
}
