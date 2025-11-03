import { ResendOTPDto } from 'src/dtos/otp.auth.request';
import { ApiResponses } from 'src/dtos/response';
import { LoginDto } from 'src/dtos/user.auth.dto';
import { CreateAccountDto } from 'src/dtos/user.createdto';
import { VerifyOTPDto } from 'src/dtos/verify.otp.request';
// ...existing code...
export const AUTH_SERVICE = Symbol('AUTH_SERVICE');
export interface AuthService {
  createAccount(data: CreateAccountDto): Promise<ApiResponses<any>>;
  resendOTP(data: ResendOTPDto): Promise<ApiResponses<any>>;
  verifyOTP(data: VerifyOTPDto): Promise<ApiResponses<any>>;
  loginUser(loginDto: LoginDto): Promise<ApiResponses<any>>;
}
