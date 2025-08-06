import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BookingService } from '../interface/booking.service';
import { CreateBookingDto, BookingResponseDto, GetBookingsQueryDto } from '../../../dtos/booking.dto';
import { ApiResponses, ApiResponseBuilder } from '../../../dtos/response';
import { BookingRepository } from '../../../domain/repository/booking.repository';
import { CustomerRepository } from '../../../domain/repository/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../../../domain/entities/car.model';
import { Booking, BookingStatus, PaymentStatus } from '../../../domain/entities/booking.model';

@Injectable()
export class BookingServiceImpl implements BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async createBooking(
    customerId: number | null,
    userId: number,
    createBookingDto: CreateBookingDto,
  ): Promise<ApiResponses<BookingResponseDto>> {
    try {
      // Find customer by userId if customerId is not provided
      let customer;
      if (customerId) {
        customer = await this.customerRepository.findById(customerId);
      } else {
        customer = await this.customerRepository.findOneByUserId(userId);
      }

      if (!customer) {
        return new ApiResponseBuilder<BookingResponseDto>()
          .setError('Customer profile not found. Please complete your profile first.')
          .build();
      }

      // Validate car exists
      const car = await this.carRepository.findOne({
        where: { id: createBookingDto.carId },
        relations: ['brand'],
      });
      if (!car) {
        return new ApiResponseBuilder<BookingResponseDto>()
          .setError('Car not found')
          .build();
      }

      if (car.status !== 'AVAILABLE') {
        return new ApiResponseBuilder<BookingResponseDto>()
          .setError('Car is not available for booking')
          .build();
      }

      // Parse dates
      const startDate = new Date(`${createBookingDto.startDate}T${createBookingDto.startTime}`);
      const endDate = new Date(`${createBookingDto.endDate}T${createBookingDto.endTime}`);

      // Validate dates
      if (startDate >= endDate) {
        return new ApiResponseBuilder<BookingResponseDto>()
          .setError('End date must be after start date')
          .build();
      }

      if (startDate < new Date()) {
        return new ApiResponseBuilder<BookingResponseDto>()
          .setError('Start date cannot be in the past')
          .build();
      }

      // Check car availability
      const isAvailable = await this.bookingRepository.checkCarAvailability(
        createBookingDto.carId,
        startDate,
        endDate,
      );

      if (!isAvailable) {
        return new ApiResponseBuilder<BookingResponseDto>()
          .setError('Car is not available for the selected dates')
          .build();
      }

      // Calculate booking details
      const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      const pricePerDay = car.price || 0;
      const totalAmount = numberOfDays * pricePerDay;

      // Generate booking reference
      const bookingReference = await this.bookingRepository.generateBookingReference();

      // Create booking
      const bookingData: Partial<Booking> = {
        bookingReference,
        customerId: customer.id,
        userId,
        carId: createBookingDto.carId,
        startDate,
        endDate,
        startTime: createBookingDto.startTime,
        endTime: createBookingDto.endTime,
        numberOfDays,
        pricePerDay,
        totalAmount,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        pickupLocation: createBookingDto.pickupLocation,
        dropoffLocation: createBookingDto.dropoffLocation,
        specialRequests: createBookingDto.specialRequests,
      };

      const booking = await this.bookingRepository.create(bookingData);
      const createdBooking = await this.bookingRepository.findById(booking.id);

      const responseData = this.mapToBookingResponse(createdBooking!);

      return new ApiResponseBuilder<BookingResponseDto>()
        .setMessage('Booking created successfully')
        .setData(responseData)
        .build();
    } catch (error: any) {
      return new ApiResponseBuilder<BookingResponseDto>()
        .setError(`Failed to create booking: ${error?.message || 'Unknown error'}`)
        .build();
    }
  }

  async getCustomerBookings(
    customerId: number | null,
    userId: number,
    query: GetBookingsQueryDto,
  ): Promise<ApiResponses<{
    bookings: BookingResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> {
    try {
      // Find customer by userId if customerId is not provided
      let customer;
      if (customerId) {
        customer = await this.customerRepository.findById(customerId);
      } else {
        customer = await this.customerRepository.findOneByUserId(userId);
      }

      if (!customer) {
        return new ApiResponseBuilder<{
          bookings: BookingResponseDto[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        }>()
          .setError('Customer profile not found')
          .build();
      }

      const { page = 1, limit = 10, status, paymentStatus } = query;

      const { bookings, total } = await this.bookingRepository.findByCustomerId(
        customer.id,
        page,
        limit,
        status,
        paymentStatus,
      );

      const responseData = {
        bookings: bookings.map((booking) => this.mapToBookingResponse(booking)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };

      return new ApiResponseBuilder<{
        bookings: BookingResponseDto[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>()
        .setMessage('Bookings retrieved successfully')
        .setData(responseData)
        .build();
    } catch (error: any) {
      return new ApiResponseBuilder<{
        bookings: BookingResponseDto[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>()
        .setError(`Failed to retrieve bookings: ${error?.message || 'Unknown error'}`)
        .build();
    }
  }

  async getBookingById(
    bookingId: number,
    customerId: number | null,
    userId: number,
  ): Promise<ApiResponses<BookingResponseDto>> {
    try {
      const booking = await this.bookingRepository.findById(bookingId);

      if (!booking) {
        return new ApiResponseBuilder<BookingResponseDto>()
          .setError('Booking not found')
          .build();
      }

      // Find customer by userId if customerId is not provided
      let customer;
      if (customerId) {
        customer = await this.customerRepository.findById(customerId);
      } else {
        customer = await this.customerRepository.findOneByUserId(userId);
      }

      if (!customer || booking.customerId !== customer.id) {
        return new ApiResponseBuilder<BookingResponseDto>()
          .setError('Unauthorized access to booking')
          .build();
      }

      const responseData = this.mapToBookingResponse(booking);

      return new ApiResponseBuilder<BookingResponseDto>()
        .setMessage('Booking retrieved successfully')
        .setData(responseData)
        .build();
    } catch (error: any) {
      return new ApiResponseBuilder<BookingResponseDto>()
        .setError(`Failed to retrieve booking: ${error?.message || 'Unknown error'}`)
        .build();
    }
  }

  private mapToBookingResponse(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      bookingReference: booking.bookingReference,
      carId: booking.carId,
      car: {
        id: booking.car.id,
        make: booking.car.make,
        model: booking.car.model,
        year: booking.car.year,
        color: booking.car.color || '',
        exteriorPhotoUrl: booking.car.exteriorPhotoUrl || '',
        pricePerDay: booking.car.price || 0,
      },
      startDate: booking.startDate,
      endDate: booking.endDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      numberOfDays: booking.numberOfDays,
      pricePerDay: booking.pricePerDay,
      totalAmount: booking.totalAmount,
      status: booking.status!,
      paymentStatus: booking.paymentStatus!,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      specialRequests: booking.specialRequests,
      dateCreated: booking.dateCreated!,
    };
  }
}
