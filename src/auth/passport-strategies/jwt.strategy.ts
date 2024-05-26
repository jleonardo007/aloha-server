import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import { NOT_AUTHORIZED } from 'src/errors';

type Payload = {
  sub: string;
  userName: string;
  iat?: number;
  exp?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const response: Response = req.res;
          return response.locals.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessTokenSecret'),
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    if (!payload.sub) {
      throw new UnauthorizedException(NOT_AUTHORIZED.MESSAGE, {
        description: NOT_AUTHORIZED.DESCRIPTION.INVALID_JWT,
      });
    }

    return payload;
  }
}
