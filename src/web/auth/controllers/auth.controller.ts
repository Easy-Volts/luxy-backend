import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiResponses } from 'src/dtos/response';
import { LoginDto } from 'src/dtos/user.auth.dto';
import { CreateAccountDto } from 'src/dtos/user.createdto';
import { AUTH_SERVICE, AuthService } from '../interface/auth.service';
import { ResendOTPDto } from 'src/dtos/otp.auth.request';
import { VerifyOTPDto } from 'src/dtos/verify.otp.request';

@Controller('api/v1/auth')
export class AuthController {
  private authService: AuthService;

  constructor(@Inject(AUTH_SERVICE) authService: AuthService) {
    this.authService = authService;
  }

  @Post('resend-otp')
  async resendOTP(@Body() data: ResendOTPDto): Promise<ApiResponses<any>> {
    return this.authService.resendOTP(data);
  }
  @Post('verify-otp')
  async verifyOTP(@Body() data: VerifyOTPDto): Promise<ApiResponses<any>> {
    return this.authService.verifyOTP(data);
  }

  @Post('create-account')
  async createAccount(
    @Body() data: CreateAccountDto,
  ): Promise<ApiResponses<any>> {
    return this.authService.createAccount(data);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponses<any>> {
    return this.authService.loginUser(loginDto);
  }
}
