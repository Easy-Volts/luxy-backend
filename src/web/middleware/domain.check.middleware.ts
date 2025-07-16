import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from 'src/log/logs.service';

@Injectable()
export class DomainCheckMiddleware implements NestMiddleware {
  constructor(private logger: CustomLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin || req.headers.host;

    this.logger.log(origin || 'Origin');
    const allowedDomains = ['localhost:8088', ''];

    const matched = allowedDomains.some((domain) => origin?.includes(domain));

    if (!matched) {
      throw new ForbiddenException('Access denied from this domain');
    }

    next();
  }
}
