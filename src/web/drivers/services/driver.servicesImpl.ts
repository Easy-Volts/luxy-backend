import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverService } from '../interfaces/driver.service';
import { DriverRepository } from 'src/domain/repository/driver.repository';
import { CustomLogger } from 'src/log/logs.service';
import { CarLendingRepository } from 'src/domain/repository/car.booking.repository';
import { ApiResponses } from 'src/dtos/response';
import { BookingResponseDto } from 'src/dtos/booking.dto';
import { apiResponse } from 'src/commons/utils/mapper';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';
import { CarLending } from 'src/domain/entities/car.lending.model';

@Injectable()
export class DriverServiceImpl implements DriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly bookingRepository: CarLendingRepository,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(DriverServiceImpl.name);
  }

  async getDriverBookings(
    user: UserDetails,
    options?: { status?: string; page?: number; limit?: number },
  ): Promise<ApiResponses<BookingResponseDto[]>> {
    this.logger.log(`Fetching bookings for driver ${user.username}`);

    const driver = await this.driverRepository.findOne({
      where: { userId: user.userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const [bookings, total] =
      await this.bookingRepository.findByDriverIdWithPagination(
        user.userId,
        options || {},
      );

    const responseData = bookings.map((booking) =>
      this.mapToBookingResponse(booking),
    );

    const response = apiResponse(
      'Driver bookings retrieved successfully',
      responseData,
    );
    response.meta = {
      total,
      page: options?.page ?? 1,
      limit: options?.limit ?? 10,
    };

    return response;
  }

  async deleteDriver(driverId: number): Promise<void> {
    const driver = await this.driverRepository.findOneById(driverId);
    if (!driver) {
      throw new Error(`Driver with ID ${driverId} not found.`);
    }
    await this.driverRepository.remove(driver);
  }

  private mapToBookingResponse(booking: CarLending): BookingResponseDto {
    return {
      paymentInitResponse: null!,
      id: booking.id,
      bookingReference: booking.bookingReference,
      bookingCode: booking.bookingCode,
      carId: booking.carId,
      carDetails: booking.car
        ? {
            make: booking.car.make,
            model: booking.car.model,
            year: booking.car.year,
            color: booking.car.color,
            licensePlate: booking.car.licensePlate,
            brand: booking.car.brand
              ? {
                  name: booking.car.brand.name,
                  image: booking.car.brand.image,
                }
              : undefined,
          }
        : undefined,
      startDate: booking.startDate.toISOString().split('T')[0],
      endDate: booking.endDate.toISOString().split('T')[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      totalDays: booking.totalDays,
      pricePerDay: Number(booking.pricePerDay),
      totalAmount: Number(booking.totalAmount),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      createdAt: booking.createdAt,
    };
  }
}
