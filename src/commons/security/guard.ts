import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { JwtPayload } from 'src/web/auth/interface/jwt-payload.interface';
import { SetMetadata } from '@nestjs/common';
import { extractTokenFromHeader } from '../utils/utils';
import { CustomLogger } from 'src/log/logs.service';

const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
dotenv.config();
const secret: string = process.env.JWT_SECRET ?? 'defaultSecret';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly logger: CustomLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }
    this.logger.log(`Verifying Auth token:::: ${request.url}`);

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      request['user'] = payload;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('JWT Verification Error:', error.message);
      }
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
