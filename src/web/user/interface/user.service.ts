import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { Users } from '../../../domain/entities/user.model';
export const USER_SERVICE = Symbol('USER_SERVICE');
export interface UserService {
  updateUserLocation(userId: number, dto: UpdateLocationDto): Promise<Users>;
}
