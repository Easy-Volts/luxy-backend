import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { JwtPayload } from 'src/web/auth/interface/jwt-payload.interface';
dotenv.config();
const secret: string = process.env.JWT_SECRET ?? 'defaultSecret';
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  JwtFromRequestFunction,
} from 'passport-jwt';

const jwtFromRequest: JwtFromRequestFunction =
  ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JWTStrategy extends PassportStrategy(JwtStrategy) {
  constructor() {
    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
