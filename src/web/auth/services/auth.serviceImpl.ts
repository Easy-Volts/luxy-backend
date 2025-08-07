import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../interface/auth.service';
import { UserRepository } from 'src/domain/repository/user.repository';
import { CustomerRepository } from 'src/domain/repository/customer.repository';
import { CustomLogger } from 'src/log/logs.service';

import { Users } from 'src/domain/entities/user.model';
import { Customer } from 'src/domain/entities/customer.model';
import { UserStatus, UserType } from 'src/enums/user.enum';
import { CreateAccountDto } from 'src/dtos/user.createdto';
import { ResendOTPDto } from 'src/dtos/otp.auth.request';
import { LoginDto } from 'src/dtos/user.auth.dto';
import { ApiResponses } from 'src/dtos/response';
import { apiResponse, mapperUser } from 'src/commons/utils/mapper';
import { VerifyOTPDto } from 'src/dtos/verify.otp.request';
import { RabbitMQService } from 'src/ampq/service/rabbitMQ';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly logger: CustomLogger,
    private readonly jwtService: JwtService,
    private readonly rabbitMQ: RabbitMQService,
  ) {
    this.logger.setContext(AuthServiceImpl.name);
  }

  async createAccount(dto: CreateAccountDto): Promise<ApiResponses<any>> {
    const {
      email,
      password,
      fullName,
      phone,
      city = '',
      state = '',
      country = '',
      userType = '',
    } = dto;

    this.logger.log(`Creating account for email: ${email}`);

    const existingUser = await this.userRepository.findOneByEmail(email!);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password!, 10);
    const [firstName, lastName = ''] = fullName!.trim().split(' ');

    const user = new Users();
    user.email = email!;
    user.firstName = firstName;
    user.lastName = lastName ?? '';
    user.phone = phone;
    user.password = hashedPassword;
    user.city = city ?? '';
    user.state = state ?? '';
    user.country = country ?? '';
    user.userType = userType ? userType : UserType.CUSTOMER;

    const savedUser = await this.userRepository.saveUser(user);

    // Send wallet creation message asynchronously
    await this.rabbitMQ.sendMessageWallet(
      {
        userId: savedUser.id,
        currency: 'NGN',
        balance: 0,
        type: 'WALLET_CREATE',
      },
      'wallet-queue',
    );

    const customer = new Customer();
    customer.userId = savedUser.id;
    customer.kycVerified = false;

    await this.customerRepository.saveCustomer(customer);

    this.logger.log(`Customer record created for user ID: ${savedUser.id}`);

    return apiResponse(true, 'Account created successfully. OTP sent.', {
      id: savedUser.id,
      fullName,
      email: savedUser.email,
    });
  }

  async resendOTP(dto: ResendOTPDto): Promise<ApiResponses<any>> {
    if (!dto.email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.userRepository.findOneByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const otp = this.generateOTP(user.email!);
    user.otpCode = otp;
    user.otpGeneratedAt = new Date();

    await this.userRepository.saveUser(user);
    await this.sendOTPMessage(user.email!, otp);

    return apiResponse(true, 'OTP resent successfully.', {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
  }

  async verifyOTP(data: VerifyOTPDto): Promise<ApiResponses<any>> {
    if (!data.email || !data.otp) {
      throw new BadRequestException('Email and OTP are required');
    }
    const user = await this.userRepository.findOneByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }
    if (user.otpCode !== data.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    if (user.otpVerified) {
      throw new ConflictException('OTP already verified');
    }
    const otpGeneratedAt = user.otpGeneratedAt;
    if (
      !otpGeneratedAt ||
      new Date().getTime() - otpGeneratedAt.getTime() > 5 * 60 * 1000
    ) {
      throw new UnauthorizedException('OTP expired');
    }
    user.otpVerified = true;
    user.status = UserStatus.ACTIVE;
    user.otpCode = undefined;
    user.otpGeneratedAt = undefined;
    await this.userRepository.saveUser(user);
    return apiResponse(true, 'OTP verified successfully.', {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
  }

  async loginUser(dto: LoginDto): Promise<ApiResponses<any>> {
    const { email, password } = dto;

    const user = await this.userRepository.findOneByEmail(email!);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.status === UserStatus.INACTIVE) {
      throw new BadRequestException('You need to verify the user');
    }

    const isPasswordValid = await bcrypt.compare(password!, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id.toString(),
      userId: user.id,
      username: user.email,
      appID: 'LUXY-APP',
      role: user.userType,
    };

    const token = await this.jwtService.signAsync(payload);
    return apiResponse(true, 'Login Successful', mapperUser(user, token));
  }

  private generateOTP(email: string): string {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    this.logger.log(`Generated OTP for ${email}: ${otp}`);
    return otp;
  }

  private async sendOTPMessage(to: string, otp: string): Promise<void> {
    await this.rabbitMQ.sendMessageOTP(
      {
        to,
        otp,
        subject: 'Verify Your Email - Luxy',
        type: 'EMAIL_VERIFICATION',
      },
      'otp-queue',
    );
  }
}
