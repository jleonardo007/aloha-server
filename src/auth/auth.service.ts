import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput, GetUserInput } from 'src/users/dto/user.input';
import { NOT_AUTHORIZED } from 'src/errors';
import { TokenInput } from './dto/auth.input';
import { JsonWebToken } from './entities/jwt-token.entity';

const enum TokenType {
  access = 'access',
  refresh = 'refresh',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(JsonWebToken.name) private readonly jwtModel: Model<JsonWebToken>,
  ) {}

  googleClient = new OAuth2Client(this.configService.get<string>('google.clientId'));

  private async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(this.configService.get<number>('encrypt.saltRounds'));
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, encryptedPassword: string) {
    return bcrypt.compare(password, encryptedPassword);
  }

  private async createJwtToken(tokenType: TokenType, { email, _id }: Pick<User, 'email' | '_id'>) {
    let token = '';

    const payload = {
      sub: _id,
      userName: email,
    };
    const accessTokenOptions: JwtSignOptions = {
      secret: this.configService.get<string>('jwt.accessTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.accessTokenExp'),
    };
    const refreshTokenOptions: JwtSignOptions = {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshTokenExp'),
    };

    if (tokenType === TokenType.access) {
      token = await this.jwtService.signAsync(payload, accessTokenOptions);
    }

    if (tokenType === TokenType.refresh) {
      token = await this.jwtService.signAsync(payload, refreshTokenOptions);
    }

    await new this.jwtModel({ value: token, type: tokenType }).save();
    return token;
  }

  async getNewAccessToken(userId: string): Promise<string> {
    const user = await this.userService.getUser(userId);
    const isJwtRevoved = await this.isTokenRevoked(user.refreshToken);

    if (isJwtRevoved) {
      throw new UnauthorizedException(NOT_AUTHORIZED.MESSAGE, {
        description: NOT_AUTHORIZED.DESCRIPTION.REFRESH_TOKEN_REVOKED,
      });
    }

    try {
      await this.jwtService.verifyAsync(user.refreshToken, {
        secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      });
      return this.createJwtToken(TokenType.access, user);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.error({ ...error, cause: 'refresh token expired' });
        await this.deleteJsonWebToken(user.refreshToken);
        user.refreshToken = await this.createJwtToken(TokenType.refresh, user);
        await user.save();

        return await this.createJwtToken(TokenType.access, user);
      }
    }
  }

  async isTokenRevoked(token) {
    const jwt = await this.jwtModel.findOne({ value: token });

    return !jwt ? true : false;
  }

  async deleteJsonWebToken(token: string) {
    await this.jwtModel.findOneAndDelete({ value: token });
  }

  async validateUserCredentials(input: GetUserInput): Promise<User> {
    const user = await this.userService.getUserByEmail(input);
    const validPassword = await this.comparePassword(input.password, user.password);

    if (validPassword) {
      return user;
    } else {
      throw new UnauthorizedException(NOT_AUTHORIZED.MESSAGE, {
        description: NOT_AUTHORIZED.DESCRIPTION.WRONG_PASSWORD,
      });
    }
  }

  async getPayloadFormToken(token: TokenInput) {
    try {
      const verifiedToken = await this.googleClient.verifyIdToken({
        idToken: token.tokenFromGoogle,
        audience: this.configService.get<string>('google.clientId'),
      });

      return await verifiedToken.getPayload();
    } catch (error) {
      throw new UnauthorizedException(NOT_AUTHORIZED.MESSAGE, {
        description: NOT_AUTHORIZED.DESCRIPTION.INVALID_JWT_FROM_GOOGLE,
      });
    }
  }

  async signUpWithEmail(input: CreateUserInput) {
    const newUser = await this.userService.createNewUser({
      email: input.email,
      password: await this.encryptPassword(input.password),
      fullName: input.fullName,
    });

    newUser.refreshToken = await this.createJwtToken(TokenType.refresh, newUser);
    const user = await newUser.save();
    const accessToken = await this.createJwtToken(TokenType.access, newUser);

    return { user, accessToken };
  }

  async signInWithEmail(input: GetUserInput) {
    const user = await this.userService.getUserByEmail(input);
    const accessToken = await this.createJwtToken(TokenType.access, user);

    return { user, accessToken };
  }

  async signUpWithGoogle(token: TokenInput) {
    const payload = await this.getPayloadFormToken(token);
    const newUser = await this.userService.createNewUser({
      fullName: payload.name,
      email: payload.email,
      profilePicture: payload.picture,
    });
    const accessToken = await this.createJwtToken(TokenType.access, newUser);
    newUser.refreshToken = await this.createJwtToken(TokenType.refresh, newUser);
    const user = await newUser.save();

    return { user, accessToken };
  }

  async signInWithGoogle(token: TokenInput) {
    const payload = await this.getPayloadFormToken(token);
    const user = await this.userService.getUserByEmail({ email: payload.email, password: '' });
    const accessToken = await this.createJwtToken(TokenType.access, user);

    return { user, accessToken };
  }

  sendCredentialsCookie(response: Response, credentials) {
    response.cookie(this.configService.get<string>('cookie.name'), credentials, {
      httpOnly: this.configService.get<boolean>('cookie.httpOnly'),
      secure: this.configService.get<boolean>('cookie.secure'),
      sameSite: this.configService.get('cookie.sameSite'),
      domain: this.configService.get<string>('cookie.domain'),
      maxAge: this.configService.get<number>('cookie.maxAge'),
    });
  }
}
