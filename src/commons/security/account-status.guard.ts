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

const ALLOW_INACTIVE_KEY = 'allowInactive';
export const AllowInactive = () => SetMetadata(ALLOW_INACTIVE_KEY, true);

@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reflector: Reflector,
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

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userRecord = await this.userRepository.findOneById(user.userId);
    
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
