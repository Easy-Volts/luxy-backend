import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/enums/user.enum';
import { JwtPayload } from 'src/web/auth/interface/jwt-payload.interface';
import { extractTokenFromHeader } from '../utils/utils';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config'; // For accessing JWT secret
import { ROLES_KEY } from '../decorator/roles.decorator';
import { CustomLogger } from 'src/log/logs.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly logger: CustomLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true; // No roles required

    const request: Request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const secret = this.configService.get<string>('JWT_SECRET');
    if (typeof secret !== 'string') {
      throw new ForbiddenException('JWT_SECRET must be a string');
    }

    if (!secret) {
      throw new ForbiddenException(
        'JWT_SECRET is not defined in environment variables',
      );
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret,
    });

    request['user'] = payload;
    this.logger.log(`User authenticated: ${JSON.stringify(payload)}`);

    if (!requiredRoles.includes(payload.role as UserType)) {
      throw new ForbiddenException(
        `Access denied for role: ${payload.username}`,
      );
    }

    return true;
  }
}
