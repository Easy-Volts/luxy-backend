import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRepository } from 'src/domain/repository/user.repository';
import { UserStatus } from 'src/enums/user.enum';
import { SetMetadata } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtPayload } from 'src/web/auth/interface/jwt-payload.interface';
import { extractTokenFromHeader } from '../utils/utils';
import { Request } from 'express';

const ALLOW_INACTIVE_KEY = 'allowInactive';
export const AllowInactive = () => SetMetadata(ALLOW_INACTIVE_KEY, true);
dotenv.config();
const secret: string = process.env.JWT_SECRET ?? 'defaultSecret';

@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowInactive = this.reflector.getAllAndOverride<boolean>(
      ALLOW_INACTIVE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If route allows inactive users, skip the check
    if (allowInactive) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret,
    });

    request['user'] = payload;

    if (!payload || !payload.userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userRecord = await this.userRepository.findOneById(payload.userId);

    if (!userRecord) {
      throw new UnauthorizedException('User not found');
    }

    if (userRecord.status === UserStatus.INACTIVE) {
      throw new ForbiddenException(
        'Your account is deactivated. Please activate your account to continue.',
      );
    }

    if (userRecord.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException(
        'Your account has been suspended. Please contact support.',
      );
    }

    if (userRecord.status === UserStatus.DELETED) {
      throw new ForbiddenException(
        'Your account has been deleted. Please contact support.',
      );
    }

    return true;
  }
}
