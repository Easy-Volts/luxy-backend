import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CarService } from '../interface/car.service';
import { UserRepository } from 'src/domain/repository/user.repository';
import { JwtPayload } from 'src/web/auth/interface/jwt-payload.interface';
import { ApiResponseBuilder, ApiResponses } from 'src/dtos/response';
import { CarRepository } from 'src/domain/repository/car.repository';
import { UserType } from 'src/enums/user.enum';
import { allCarsResponse } from 'src/commons/utils/mapper';

@Injectable()
export class CarServiceImpl implements CarService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly carRepository: CarRepository,
  ) {}

  async getAvailableCars(req: JwtPayload): Promise<ApiResponses<any>> {
    const user = await this.userRepository.findOneById(req.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.userType !== UserType.CUSTOMER) {
      throw new ForbiddenException('Access denied');
    }

    const cars = await this.carRepository.findAvailableCars();
    return new ApiResponseBuilder()
      .setMessage('Available cars fetched successfully')
      .setData(allCarsResponse(cars, user))
      .build();
  }
}
