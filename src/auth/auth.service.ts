import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput, GetUserInput } from 'src/users/dto/user.input';
import { UserOutput } from 'src/users/dto/user.output';
import { TokenInput } from './dto/auth.input';

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
  ) {}

  googleClient = new OAuth2Client(this.configService.get<string>('google.clientId'));

  private async encryptPassoword(password: string) {
    const SALT_ROUNDS = 10;
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  private async comparePassword(password: string, encryptedPassoword: string) {
    return await bcrypt.compare(password, encryptedPassoword);
  }

  private async createJwtToken(tokenType: TokenType, { email, _id }: Pick<User, 'email' | '_id'>) {
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
      return this.jwtService.signAsync(payload, accessTokenOptions);
    }

    if (tokenType === TokenType.refresh) {
      return this.jwtService.sign(payload, refreshTokenOptions);
    }
  }

  async generateNewAccessToken(userId: string): Promise<string> {
    const user = await this.userService.getUser(userId);
    const isValidToken = await this.jwtService.verifyAsync(user.refreshToken, {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
    });

    if (isValidToken) {
      return await this.createJwtToken(TokenType.access, user);
    }
  }

  async generateNewRefreshToken(userId: string): Promise<string> {
    const user = await this.userService.getUser(userId);
    user.refreshToken = await this.createJwtToken(TokenType.refresh, user);

    await user.save();
    return await this.createJwtToken(TokenType.access, user);
  }

  async validateUserCredentials(getUserInput: GetUserInput): Promise<User> {
    const user = await this.userService.getUserByEmail(getUserInput);
    const validPassword = await this.comparePassword(getUserInput.password, user.password);

    if (validPassword) {
      return user;
    } else {
      throw new UnauthorizedException('Wrong Password');
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
      throw new UnauthorizedException('Invalid token');
    }
  }

  async signUpWithEmail(signUpInput: CreateUserInput): Promise<UserOutput> {
    const newUser = await this.userService.createNewUser({
      email: signUpInput.email,
      password: await this.encryptPassoword(signUpInput.password),
      fullName: signUpInput.fullName,
    });

    newUser.refreshToken = await this.createJwtToken(TokenType.refresh, newUser);
    await newUser.save();

    return {
      ...newUser.toObject(),
      accessToken: await this.createJwtToken(TokenType.access, newUser),
    };
  }

  async signInWithEmail(signInInput: GetUserInput): Promise<UserOutput> {
    const user = await this.userService.getUserByEmail(signInInput);
    const accessToken = await this.createJwtToken(TokenType.access, user);

    return {
      ...user.toObject(),
      accessToken,
    };
  }

  async signUpWithGoogle(token: TokenInput) {
    const payload = await this.getPayloadFormToken(token);
    const newUser = await this.userService.createNewUser({
      fullName: payload.name,
      email: payload.email,
      profilePicture: payload.picture,
    });

    newUser.refreshToken = await this.createJwtToken(TokenType.refresh, newUser);
    await newUser.save();

    return {
      ...newUser.toObject(),
      accessToken: await this.createJwtToken(TokenType.access, newUser),
    };
  }

  async signInWithGoogle(token: TokenInput) {
    const payload = await this.getPayloadFormToken(token);
    const user = await this.userService.getUserByEmail({ email: payload.email, password: '' });
    const accessToken = await this.createJwtToken(TokenType.access, user);

    return {
      ...user.toObject(),
      accessToken,
    };
  }
}
