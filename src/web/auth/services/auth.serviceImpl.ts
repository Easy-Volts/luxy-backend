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
import { CustomLogger } from 'src/log/logs.service';
import { RabbitMQService } from 'src/ampq/rabbitMQ';

import { Users } from 'src/domain/entities/user.model';
import { UserStatus } from 'src/enums/user.enum';
import { CreateAccountDto } from 'src/dtos/user.createdto';
import { ResendOTPDto } from 'src/dtos/otp.auth.request';
import { LoginDto } from 'src/dtos/user.auth.dto';
import { ApiResponses } from 'src/dtos/response';
import { apiResponse, mapperUser } from 'src/commons/utils/mapper';
import { VerifyOTPDto } from 'src/dtos/verify.otp.request';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepository: UserRepository,
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
    user.phone = Number(phone);
    user.password = hashedPassword;
    user.city = city ?? '';
    user.state = state ?? '';
    user.country = country ?? '';

    const savedUser = await this.userRepository.saveUser(user);

    return apiResponse({
      success: true,
      message: 'Account created successfully. OTP sent.',
      data: {
        id: savedUser.id,
        fullName,
        email: savedUser.email,
      },
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

    return apiResponse({
      success: true,
      message: 'OTP resent successfully.',
      data: {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
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
    return apiResponse({
      success: true,
      message: 'OTP verified successfully.',
      data: {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
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
      username: user.email,
      appID: 'LUXY-APP',
      ROLE: user.userType,
    };

    const token = await this.jwtService.signAsync(payload);
    return apiResponse(mapperUser(user, token));
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
