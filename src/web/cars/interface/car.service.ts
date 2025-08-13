import { ApiResponses } from 'src/dtos/response';
import { JwtPayload } from 'src/web/auth/interface/jwt-payload.interface';
export const CAR_SERVICE = Symbol('CAR_SERVICE');
export interface CarService {
  getAvailableCars(req: JwtPayload): Promise<ApiResponses<any>>;
}
