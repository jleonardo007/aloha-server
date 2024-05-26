import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Response, Request } from 'express';
import { CreateUserInput, GetUserInput } from 'src/users/dto/user.input';
import { UserOutput } from 'src/users/dto/user.output';
import { TokenInput } from './dto/auth.input';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { NOT_AUTHORIZED } from 'src/errors';
@Resolver()
@Public()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserOutput)
  async signUpWithEmail(
    @Context('res') response: Response,
    @Args('signUpInput') signUpInput: CreateUserInput,
  ): Promise<UserOutput> {
    const { user, accessToken } = await this.authService.signUpWithEmail(signUpInput);
    this.authService.sendCredentialsCookie(response, { accessToken, userId: user._id });

    return user;
  }

  @Query(() => UserOutput)
  @UseGuards(LocalAuthGuard)
  async signInWithEmail(
    @Context('res') response: Response,
    @Args('signInInput') signInInput: GetUserInput,
  ) {
    const { user, accessToken } = await this.authService.signInWithEmail(signInInput);
    this.authService.sendCredentialsCookie(response, { accessToken, userId: user._id });

    return user;
  }

  @Mutation(() => UserOutput)
  async signUpWithGoogle(
    @Context('res') response: Response,
    @Args('tokenInput') tokenInput: TokenInput,
  ) {
    const { user, accessToken } = await this.authService.signUpWithGoogle(tokenInput);
    this.authService.sendCredentialsCookie(response, { accessToken, userId: user._id });

    return user;
  }

  @Query(() => UserOutput)
  async signInWithGoogle(
    @Context('res') response: Response,
    @Args('tokenInput') tokenInput: TokenInput,
  ): Promise<UserOutput> {
    const { user, accessToken } = await this.authService.signInWithGoogle(tokenInput);
    this.authService.sendCredentialsCookie(response, { accessToken, userId: user._id });

    return user;
  }

  @Query(() => String)
  verifyExpiredCrendials(@Context('req') request: Request): string {
    const credentials = request.cookies['credentials'];

    if (!credentials) {
      throw new UnauthorizedException(NOT_AUTHORIZED.MESSAGE, {
        description: NOT_AUTHORIZED.DESCRIPTION.CREDENTIALS_EXPIRED,
      });
    }

    return 'CREDENTIALS_NOT_EXPIRED';
  }
}
