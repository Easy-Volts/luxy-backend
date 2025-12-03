import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverService } from '../interfaces/driver.service';
import { DriverRepository } from 'src/domain/repository/driver.repository';
import { UserRepository } from 'src/domain/repository/user.repository';
import { CarRepository } from 'src/domain/repository/car.repository';
import { CustomLogger } from 'src/log/logs.service';
import { CarLendingRepository } from 'src/domain/repository/car.booking.repository';
import { ReviewRepository } from 'src/domain/repository/review.repository';
import { ApiResponses } from 'src/dtos/response';
import { BookingResponseDto } from 'src/dtos/booking.dto';
import { ReviewResponseDto, ReviewStatsDto } from 'src/dtos/review.dto';
import {
  DriverDetailsResponseDto,
  DriverStatsDto,
  DriverCarDetailsDto,
  DriverContactDto,
} from 'src/dtos/driver.details.dto';
import { DriverQueryDto } from 'src/dtos/driver.query.dto';
import { apiResponse } from 'src/commons/utils/mapper';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';
import { CarLending } from 'src/domain/entities/car.lending.model';
import { Review } from 'src/domain/entities/review.model';
import { Driver } from 'src/domain/entities/driver.model';

@Injectable()
export class DriverServiceImpl implements DriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly userRepository: UserRepository,
    private readonly carRepository: CarRepository,
    private readonly bookingRepository: CarLendingRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(DriverServiceImpl.name);
  }

  async getDriverDetails(
    user: UserDetails,
  ): Promise<ApiResponses<DriverDetailsResponseDto>> {
    this.logger.log(`Fetching driver details for user ${user.username}`);

    // Fetch driver record
    const driver = await this.driverRepository.findOne({
      where: { userId: user.userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }

    // Fetch user details
    const userDetails = await this.userRepository.findOneById(user.userId);
    if (!userDetails) {
      throw new NotFoundException('User not found');
    }

    // Fetch driver statistics
    const [totalReviews, averageRating, totalBookings] = await Promise.all([
      this.reviewRepository.getTotalReviewsCount(user.userId),
      this.reviewRepository.getAverageRating(user.userId),
      this.bookingRepository.countByDriverId(user.userId),
    ]);

    // Calculate years of experience (from account creation date)
    const yearsExperience = userDetails.dateCreated
      ? Math.floor(
          (new Date().getTime() - new Date(userDetails.dateCreated).getTime()) /
            (1000 * 60 * 60 * 24 * 365),
        )
      : 0;

    // Build statistics
    const stats: DriverStatsDto = {
      totalCustomers: totalBookings,
      yearsExperience: yearsExperience,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: totalReviews,
    };

    // Fetch car details if driver has completed bookings
    let carDetails: DriverCarDetailsDto | undefined;
    const recentBooking =
      await this.bookingRepository.findRecentByDriverId(user.userId);

    if (recentBooking && recentBooking.car) {
      const car = recentBooking.car;
      carDetails = {
        carId: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        carModel: `${car.make} ${car.model} ${car.year}`,
        carNumber: car.licensePlate,
        carColor: car.color,
      };
    }

    // Build contact information
    const contact: DriverContactDto = {
      name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || 'Driver',
      role: 'Driver',
      imageUrl: userDetails.imageUrl,
      userId: user.userId,
    };

    // Build location string
    const location = [userDetails.city, userDetails.country]
      .filter(Boolean)
      .join(', ');

    // Build driver details response
    const driverDetailsResponse: DriverDetailsResponseDto = {
      id: driver.id!,
      name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim(),
      email: userDetails.email || '',
      location: location || undefined,
      imageUrl: userDetails.imageUrl,
      phone: userDetails.phone,
      stats: stats,
      about: undefined, // Can be added to driver entity in the future
      contact: contact,
      carDetails: carDetails,
      kycVerified: driver.kycVerified,
      status: userDetails.status,
      dateCreated: userDetails.dateCreated,
    };

    return apiResponse(
      'Driver details retrieved successfully',
      driverDetailsResponse,
    );
  }

  async getAllDrivers(
    queryDto: DriverQueryDto,
  ): Promise<ApiResponses<DriverDetailsResponseDto[]>> {
    this.logger.log(
      `Fetching all drivers with filters: ${JSON.stringify(queryDto)}`,
    );

    // Fetch drivers with pagination and filters
    const [drivers, total] =
      await this.driverRepository.findAllWithPagination(queryDto);

    // Build response for each driver
    const driverDetailsPromises = drivers.map(async (driver) =>
      this.buildDriverDetailsResponse(driver),
    );

    const driverDetails = await Promise.all(driverDetailsPromises);

    const response = apiResponse(
      'Drivers retrieved successfully',
      driverDetails,
    );

    response.meta = {
      total,
      page: queryDto.page ?? 1,
      limit: queryDto.limit ?? 10,
      totalPages: Math.ceil(total / (queryDto.limit ?? 10)),
    };

    return response;
  }

  private async buildDriverDetailsResponse(
    driver: Driver,
  ): Promise<DriverDetailsResponseDto> {
    const userDetails = driver.user;

    if (!userDetails) {
      throw new NotFoundException('User details not found for driver');
    }

    // Fetch driver statistics in parallel
    const [totalReviews, averageRating, totalBookings] = await Promise.all([
      this.reviewRepository.getTotalReviewsCount(userDetails.id!),
      this.reviewRepository.getAverageRating(userDetails.id!),
      this.bookingRepository.countByDriverId(userDetails.id!),
    ]);

    // Calculate years of experience
    const yearsExperience = userDetails.dateCreated
      ? Math.floor(
          (new Date().getTime() - new Date(userDetails.dateCreated).getTime()) /
            (1000 * 60 * 60 * 24 * 365),
        )
      : 0;

    // Build statistics
    const stats: DriverStatsDto = {
      totalCustomers: totalBookings,
      yearsExperience: yearsExperience,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: totalReviews,
    };

    // Fetch car details if available
    let carDetails: DriverCarDetailsDto | undefined;
    const recentBooking = await this.bookingRepository.findRecentByDriverId(
      userDetails.id!,
    );

    if (recentBooking && recentBooking.car) {
      const car = recentBooking.car;
      carDetails = {
        carId: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        carModel: `${car.make} ${car.model} ${car.year}`,
        carNumber: car.licensePlate,
        carColor: car.color,
      };
    }

    // Build contact information
    const contact: DriverContactDto = {
      name:
        `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() ||
        'Driver',
      role: 'Driver',
      imageUrl: userDetails.imageUrl,
      userId: userDetails.id!,
    };

    // Build location string
    const location = [userDetails.city, userDetails.country]
      .filter(Boolean)
      .join(', ');

    return {
      id: driver.id!,
      name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim(),
      email: userDetails.email || '',
      location: location || undefined,
      imageUrl: userDetails.imageUrl,
      phone: userDetails.phone,
      stats: stats,
      about: undefined,
      contact: contact,
      carDetails: carDetails,
      kycVerified: driver.kycVerified,
      status: userDetails.status,
      dateCreated: userDetails.dateCreated,
    };
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

  async getDriverRatings(
    user: UserDetails,
  ): Promise<ApiResponses<ReviewResponseDto[]>> {
    this.logger.log(`Fetching ratings for driver ${user.username}`);

    const driver = await this.driverRepository.findOne({
      where: { userId: user.userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Get all reviews where the driver is the reviewee (reviews about the driver)
    const reviews = await this.reviewRepository.findByRevieweeId(user.userId);

    const responseData = reviews.map((review) =>
      this.mapToReviewResponse(review),
    );

    return apiResponse(
      'Driver ratings retrieved successfully',
      responseData,
    );
  }

  async getDriverRatingStats(
    user: UserDetails,
  ): Promise<ApiResponses<ReviewStatsDto>> {
    this.logger.log(`Fetching rating statistics for driver ${user.username}`);

    const driver = await this.driverRepository.findOne({
      where: { userId: user.userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const [averageRating, totalReviews, ratingDistribution] =
      await Promise.all([
        this.reviewRepository.getAverageRating(user.userId),
        this.reviewRepository.getTotalReviewsCount(user.userId),
        this.reviewRepository.getRatingDistribution(user.userId),
      ]);

    // Calculate percentages for rating distribution
    const distributionWithPercentages = ratingDistribution.map((item) => ({
      rating: item.rating,
      count: parseInt(item.count),
      percentage:
        totalReviews > 0
          ? Math.round((parseInt(item.count) / totalReviews) * 100)
          : 0,
    }));

    const stats: ReviewStatsDto = {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution: distributionWithPercentages,
    };

    return apiResponse(
      'Driver rating statistics retrieved successfully',
      stats,
    );
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

  private mapToReviewResponse(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      reviewerId: review.reviewerId,
      revieweeId: review.revieweeId,
      carId: review.carId,
      reviewType: review.reviewType,
      bookingId: review.bookingId,
      isActive: review.isActive,
      dateCreated: review.dateCreated,
      lastUpdated: review.lastUpdated,
      reviewer: review.reviewer
        ? {
            id: review.reviewer.id!,
            firstName: review.reviewer.firstName || '',
            lastName: review.reviewer.lastName || '',
            imageUrl: review.reviewer.imageUrl,
          }
        : undefined,
      reviewee: review.reviewee
        ? {
            id: review.reviewee.id!,
            firstName: review.reviewee.firstName || '',
            lastName: review.reviewee.lastName || '',
            imageUrl: review.reviewee.imageUrl,
          }
        : undefined,
      car: review.car
        ? {
            id: review.car.id!,
            make: review.car.make,
            model: review.car.model,
            year: review.car.year,
          }
        : undefined,
    };
  }
}
