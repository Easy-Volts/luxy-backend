import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiResponses } from 'src/dtos/response';
import { LoginDto } from 'src/dtos/user.auth.dto';
import { CreateAccountDto } from 'src/dtos/user.createdto';
import { AUTH_SERVICE, AuthService } from './interface/auth.service';
import { ResendOTPDto } from 'src/dtos/otp.auth.request';
import { VerifyOTPDto } from 'src/dtos/verify.otp.request';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DriverRegistrationDto,
  DriverLoginDto,
} from 'src/dtos/driver.auth.dto';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  private authService: AuthService;

  constructor(@Inject(AUTH_SERVICE) authService: AuthService) {
    this.authService = authService;
  }

  @ApiOperation({ summary: 'Resend OTP successfully' })
  @ApiBody({ type: ResendOTPDto })
  @ApiResponse({
    status: 200,
    description: 'Resend OTP successfully',
  })
  @Post('resend-otp')
  async resendOTP(@Body() data: ResendOTPDto): Promise<ApiResponses<any>> {
    return this.authService.resendOTP(data);
  }

  @ApiOperation({ summary: 'Verify OTP successfully' })
  @ApiBody({ type: VerifyOTPDto })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
  })
  @Post('verify-otp')
  async verifyOTP(@Body() data: VerifyOTPDto): Promise<ApiResponses<any>> {
    return this.authService.verifyOTP(data);
  }

  @ApiOperation({ summary: 'Create Account successfully' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({
    status: 200,
    description: 'Account created successfully',
  })
  @Post('create-account')
  async createAccount(
    @Body() data: CreateAccountDto,
  ): Promise<ApiResponses<any>> {
    return this.authService.createAccount(data);
  }

  @ApiOperation({ summary: 'Login successfully' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponses<any>> {
    return this.authService.loginUser(loginDto);
  }

  @ApiOperation({ summary: 'Register driver account successfully' })
  @ApiBody({ type: DriverRegistrationDto })
  @ApiResponse({
    status: 200,
    description: 'Driver account created successfully',
  })
  @Post('driver/register')
  async registerDriver(
    @Body() data: DriverRegistrationDto,
  ): Promise<ApiResponses<any>> {
    return this.authService.registerDriver(data);
  }

  @ApiOperation({ summary: 'Driver login successfully' })
  @ApiBody({ type: DriverLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Driver login successful',
  })
  @Post('driver/login')
  async loginDriver(
    @Body() loginDto: DriverLoginDto,
  ): Promise<ApiResponses<any>> {
    return this.authService.loginDriver(loginDto);
  }
}
