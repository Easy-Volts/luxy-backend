import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiResponses } from 'src/dtos/response';
import { LoginDto } from 'src/dtos/user.auth.dto';
import { CreateAccountDto } from 'src/dtos/user.createdto';
import { AUTH_SERVICE, AuthService } from '../interface/auth.service';
import { ResendOTPDto } from 'src/dtos/otp.auth.request';
import { VerifyOTPDto } from 'src/dtos/verify.otp.request';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  private authService: AuthService;

  constructor(@Inject(AUTH_SERVICE) authService: AuthService) {
    this.authService = authService;
  }

  @ApiOperation({ summary: 'Resend OTP successfully' })
  @ApiParam(ResendOTPDto)
  @ApiResponse({
    status: 200,
    description: 'Resend OTP successfully',
    type: ResendOTPDto,
  })
  @Post('resend-otp')
  async resendOTP(@Body() data: ResendOTPDto): Promise<ApiResponses<any>> {
    return this.authService.resendOTP(data);
  }

  @ApiOperation({ summary: 'VerifyOTPDto successfully' })
  @ApiParam(VerifyOTPDto)
  @ApiResponse({
    status: 200,
    description: 'VerifyOTPDto successfully',
    type: VerifyOTPDto,
  })
  @Post('verify-otp')
  async verifyOTP(@Body() data: VerifyOTPDto): Promise<ApiResponses<any>> {
    return this.authService.verifyOTP(data);
  }

  @ApiOperation({ summary: 'CreateAccount successfully' })
  @ApiParam(CreateAccountDto)
  @ApiResponse({
    status: 200,
    description: 'CreateAccount successfully',
    type: CreateAccountDto,
  })
  @Post('create-account')
  async createAccount(
    @Body() data: CreateAccountDto,
  ): Promise<ApiResponses<any>> {
    return this.authService.createAccount(data);
  }

  @ApiOperation({ summary: 'Login successfully' })
  @ApiParam(LoginDto)
  @ApiResponse({
    status: 200,
    description: 'Login successfully',
    type: LoginDto,
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponses<any>> {
    return this.authService.loginUser(loginDto);
  }
}
