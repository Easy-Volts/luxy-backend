import { Car } from 'src/domain/entities/car.model';
import { Users } from 'src/domain/entities/user.model';
import { CarResponseDto } from 'src/dtos/car.response';
import { ApiResponseBuilder } from 'src/dtos/response';

export const mapperUser = (user: Users, token: string) => {
  return {
    id: user.id,
    email: user.email,
    name: user.firstName,
    phoneNumber: user.phone,
    token: token,
    status: user.status,
    type: user.userType,
    phoneVerified: user.phoneVerified,
    deviceId: user.deviceId,
    imageUrl: user.imageUrl,
    emailVerified: user.otpVerified,
    locationVerified: user.locationVerified,
  };
};

export const apiResponse = (message: string, data: any) => {
  return new ApiResponseBuilder<any>()
    .setMessage(message)
    .setData(data)
    .build();
};

export const allCarsResponse = (
  cars: Car[],
  users: Users,
): CarResponseDto[] => {
  if (!cars || cars.length === 0) {
    return [];
  }
  return cars.map((car) => {
    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
      licensePlate: car.licensePlate,
      vin: car.vin,
      transmissionType: car.transmissionType,
      fuelType: car.fuelType,
      hasEscort: car.hasEscort,
      conditionReport: car.conditionReport,
      features: car.features,
      exteriorPhotoUrl: car.exteriorPhotoUrl,
      interiorPhotoUrl: car.interiorPhotoUrl,
      numberOfSeats: car.numberOfSeats,
      carLocation: users._address,
      vehicleLicenseUrl: car.vehicleLicenseUrl,
      roadworthinessUrl: car.roadworthinessUrl,
      ownershipCertificateUrl: car.ownershipCertificateUrl,
      brand: car?.brand ?? undefined,
      vendor: car?.vendor ?? undefined,
      status: car.status,
    };
  });
};
