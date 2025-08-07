import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiParam, 
  ApiResponse, 
  ApiBody 
} from '@nestjs/swagger';
import { CarRepository } from 'src/domain/repository/car.repository';
import { Car } from 'src/domain/entities/car.model';
import { AuthGuard } from 'src/commons/security/guard';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { UserType } from 'src/enums/user.enum';
import { Roles } from 'src/commons/decorator/roles.decorator';
import { Authenticated } from 'src/commons/decorator/auth.decorator';
import { ApiResponses } from 'src/dtos/response';
import { apiResponse } from 'src/commons/utils/mapper';

@ApiTags('Cars')
@Controller('api/v1/cars')
@UseGuards(AuthGuard, RolesGuard)
@Authenticated()
export class CarController {
  constructor(
    private readonly carRepository: CarRepository,
  ) {}

  @Get()
  @Roles(UserType.CUSTOMER, UserType.ADMIN, UserType.VENDOR)
  @ApiOperation({ summary: 'Get all available cars' })
  @ApiResponse({
    status: 200,
    description: 'Cars retrieved successfully',
    type: [Car],
  })
  async getAllCars(): Promise<ApiResponses<Car[]>> {
    const cars = await this.carRepository.findAvailableCars();
    return apiResponse(true, 'Cars retrieved successfully', cars);
  }

  @Get(':id')
  @Roles(UserType.CUSTOMER, UserType.ADMIN, UserType.VENDOR)
  @ApiOperation({ summary: 'Get car by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Car ID' })
  @ApiResponse({
    status: 200,
    description: 'Car retrieved successfully',
    type: Car,
  })
  async getCarById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponses<Car>> {
    const car = await this.carRepository.findById(id);
    if (!car) {
      return apiResponse(false, 'Car not found', null);
    }
    return apiResponse(true, 'Car retrieved successfully', car);
  }
}
