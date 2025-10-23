import { ResendOTPDto } from 'src/dtos/otp.auth.request';
import { ApiResponses } from 'src/dtos/response';
import { LoginDto } from 'src/dtos/user.auth.dto';
import { CreateAccountDto } from 'src/dtos/user.createdto';
import { VerifyOTPDto } from 'src/dtos/verify.otp.request';
import {
  DriverRegistrationDto,
  DriverLoginDto,
} from 'src/dtos/driver.auth.dto';
export const AUTH_SERVICE = Symbol('AUTH_SERVICE');
export interface AuthService {
  createAccount(data: CreateAccountDto): Promise<ApiResponses<any>>;
  resendOTP(data: ResendOTPDto): Promise<ApiResponses<any>>;
  verifyOTP(data: VerifyOTPDto): Promise<ApiResponses<any>>;
  loginUser(loginDto: LoginDto): Promise<ApiResponses<any>>;
  registerDriver(data: DriverRegistrationDto): Promise<ApiResponses<any>>;
  loginDriver(loginDto: DriverLoginDto): Promise<ApiResponses<any>>;
}
