import { Controller, Patch, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CAR_SERVICE, CarService } from '../interface/car.service';
import { AuthGuard } from 'src/commons/security/guard';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { UserType } from 'src/enums/user.enum';
import { Roles } from 'src/commons/decorator/roles.decorator';
import { Authenticated } from 'src/commons/decorator/auth.decorator';
import { ApiResponses } from 'src/dtos/response';
import { CurrentUser } from 'src/commons/decorator/current-user.decorator';
import { CarResponseDto } from 'src/dtos/car.response';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';
@ApiTags('Cars ')
@Controller('cars')
@UseGuards(AuthGuard, RolesGuard)
@Authenticated()
@Roles(UserType.ADMIN, UserType.CUSTOMER)
export class CarController {
  private carService: CarService;
  constructor(@Inject(CAR_SERVICE) carService: CarService) {
    this.carService = carService;
  }
  @Patch('/')
  @ApiOperation({ summary: 'Get all cars ' })
  @ApiResponse({
    status: 200,
    description: 'Get All cars',
    type: CarResponseDto,
  })
  async getAvailableCars(
    @CurrentUser() req: UserDetails,
  ): Promise<ApiResponses<any>> {
    return this.carService.getAvailableCars(req);
  }
}
