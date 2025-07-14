import { Users } from 'src/domain/entities/user.model';
import { ApiResponseBuilder } from 'src/dtos/response';

export const mapperUser = (user: Users, token: string) => {
  return {
    id: user.id,
    email: user.email,
    name: user.firstName,
    status: user.status,
    type: user.userType,
    phoneNumber: user.phone,
    phoneVerified: user.phoneVerified,
    deviceId: user.deviceId,
    deviceToken: user.deviceToken,
    imageUrl: user.imageUrl,
    token: token,
  };
};

export const apiResponse = (data: any) => {
  return new ApiResponseBuilder<any>()
    .setMessage('Api Recieved')
    .setData(data)
    .build();
};
