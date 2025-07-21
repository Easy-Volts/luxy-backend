import { Users } from 'src/domain/entities/user.model';
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

export const apiResponse = (status: boolean, message: string, data: any) => {
  return new ApiResponseBuilder<any>()
    .setMessage(message)
    .setData(data)
    .build();
};
