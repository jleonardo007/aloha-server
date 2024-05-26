import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const request: Request = gqlContext.getContext().req;
    const response: Response = request.res;
    const credentials = request.cookies['credentials'];
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      gqlContext.getHandler(),
      gqlContext.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!credentials) {
      throw new UnauthorizedException('NOT_AUTHORIZED', { description: 'CREDENTIALS_NOT_FOUND' });
    } else if (await this.authService.isTokenRevoked(credentials.accessToken)) {
      throw new UnauthorizedException('NOT_AUTHORIZED', { description: 'ACCESS_TOKEN_REVOKED' });
    } else {
      try {
        await this.jwtService.verifyAsync(credentials.accessToken, {
          secret: this.configService.get<string>('jwt.accessTokenSecret'),
        });
        response.locals.accessToken = credentials.accessToken;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          console.error({ ...error, cause: 'access token expired' });
          try {
            await this.authService.deleteJsonWebToken(credentials.accessToken);
            response.locals.accessToken = await this.authService.getNewAccessToken(
              credentials.userId,
            );

            this.authService.sendCredentialsCookie(response, {
              ...credentials,
              accessToken: response.locals.accessToken,
            });
          } catch (error) {
            //Throws when revoked refresh token is used
            throw error;
          }
        }
      }
    }

    return true;
  }
}
