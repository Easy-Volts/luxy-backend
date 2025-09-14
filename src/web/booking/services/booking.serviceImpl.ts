import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { BookingService } from '../interface/booking.service';
import { CarLendingRepository } from 'src/domain/repository/car.booking.repository';
import { CarRepository } from 'src/domain/repository/car.repository';
import { CustomerRepository } from 'src/domain/repository/customer.repository';
import { CustomLogger } from 'src/log/logs.service';
import { CreateBookingDto, BookingResponseDto } from 'src/dtos/booking.dto';
import { ApiResponses } from 'src/dtos/response';
import { apiResponse } from 'src/commons/utils/mapper';
import { CarLending } from 'src/domain/entities/car.lending.model';
import { BookingStatus, PaymentStatus } from 'src/enums/user.enum';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';
import { PaymentGatewayService } from 'src/payment/services/payment.gateway';
import { PaymentInitResponse } from 'src/dtos/payment-init-response.dto';
@Injectable()
export class BookingServiceImpl implements BookingService {
  constructor(
    private readonly bookingRepository: CarLendingRepository,
    private readonly carRepository: CarRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly paymentService: PaymentGatewayService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(BookingServiceImpl.name);
  }

  async createBooking(
    user: UserDetails,
    dto: CreateBookingDto,
  ): Promise<ApiResponses<BookingResponseDto>> {
    this.logger.log(
      `Creating booking for customer ${user.username}, car ${dto.carId}`,
    );

    // Validate customer exists
    const customer = await this.customerRepository.findOneByUserId(user.userId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Validate car exists and is available
    const car = await this.carRepository.findById(dto.carId);
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (car.status !== 'AVAILABLE') {
      throw new BadRequestException('Car is not available for booking');
    }

    // Validate dates
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Check availability
    const conflictingBookings =
      await this.bookingRepository.findBookingsByDateRange(
        dto.carId,
        startDate,
        endDate,
      );

    if (conflictingBookings.length > 0) {
      throw new ConflictException(
        'Car is not available for the selected dates',
      );
    }

    // Calculate pricing
    if (!car.price) {
      throw new BadRequestException('Car price is not set');
    }

    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    this.logger.log('Days' + totalDays);
    const pricePerDay = Number(car.price);
    const subtotal = pricePerDay * totalDays;

    const taxRate = 0.075; // 7.5% tax
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    let bookingReference: string = '';
    let isUnique = false;

    while (!isUnique) {
      bookingReference = this.generateBookingReference();
      const existing =
        await this.bookingRepository.findByReference(bookingReference);
      if (!existing) {
        isUnique = true;
      }
    }

    // Create booking
    const booking = new CarLending();
    booking.bookingReference = bookingReference;
    booking.customerId = customer.id!;
    booking.carId = dto.carId;
    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.startTime = dto.startTime;
    booking.endTime = dto.endTime;
    booking.totalDays = totalDays;
    booking.pricePerDay = pricePerDay;
    booking.totalAmount = totalAmount;
    booking.taxAmount = taxAmount;
    booking.status = BookingStatus.PENDING;
    booking.paymentStatus = PaymentStatus.PENDING;
    booking.paymentMethod = dto.paymentMethod;
    booking.specialRequests = dto.specialRequests;
    booking.pickupLocation = dto.pickupLocation;
    booking.returnLocation = dto.returnLocation;

    const savedBooking = await this.bookingRepository.saveBooking(booking);
    const payload = {
      amount: totalAmount,
      email: user.sub,
      username: user.username,
      currency: 'NGN',
      source: bookingReference,
      userId: user.userId,
    };
    const response = await this.paymentService.processPayment(payload);
    const responseData = this.mapToBookingResponsePayemnt(
      savedBooking,
      response,
    );

    this.logger.log(`Booking created successfully: ${bookingReference}`);

    return apiResponse('Booking created successfully', responseData);
  }

  async getCustomerBookings(
    user: UserDetails,
    options?: { status?: string; page?: number; limit?: number },
  ): Promise<ApiResponses<BookingResponseDto[]>> {
    this.logger.log(`Fetching bookings for customer ${user.username}`);

    const customer = await this.customerRepository.findOneByUserId(user.userId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const [bookings, total] =
      await this.bookingRepository.findByCustomerIdWithPagination(
        customer.id!,
        options || {},
      );

    const responseData = bookings.map((booking) =>
      this.mapToBookingResponse(booking),
    );

    const response = apiResponse(
      'Bookings retrieved successfully',
      responseData,
    );
    response.meta = {
      total,
      page: options?.page ?? 1,
      limit: options?.limit ?? 10,
    };

    return response;
  }

  async getAllBookings(): Promise<ApiResponses<BookingResponseDto[]>> {
    this.logger.log('Fetching all bookings');

    const bookings = await this.bookingRepository.findAll();
    const responseData = bookings.map((booking) =>
      this.mapToBookingResponse(booking),
    );

    return apiResponse('All bookings retrieved successfully', responseData);
  }

  private generateBookingReference(): string {
    const prefix = 'LBK';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${prefix}${timestamp.slice(-8)}${random}`;
  }

  private mapToBookingResponse(booking: CarLending): BookingResponseDto {
    return {
      paymentInitResponse: null!,
      id: booking.id,
      bookingReference: booking.bookingReference,
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
  private mapToBookingResponsePayemnt(
    booking: CarLending,
    paymentInitResponse: PaymentInitResponse,
  ): BookingResponseDto {
    return {
      paymentInitResponse: paymentInitResponse,
      id: booking.id,
      bookingReference: booking.bookingReference,
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
