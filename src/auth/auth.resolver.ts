import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Response, Request } from 'express';
import { CreateUserInput, GetUserInput } from 'src/users/dto/user.input';
import { UserOutput } from 'src/users/dto/user.output';
import { TokenInput, CredentialInput } from './dto/auth.input';
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
    @Args('input') input: CreateUserInput,
  ): Promise<UserOutput> {
    const { user, accessToken } = await this.authService.signUpWithEmail(input);
    this.authService.sendCredentialsCookie(response, { accessToken, userId: user._id });

    return user;
  }

  @Query(() => UserOutput)
  @UseGuards(LocalAuthGuard)
  async signInWithEmail(@Context('res') response: Response, @Args('input') input: GetUserInput) {
    const { user, accessToken } = await this.authService.signInWithEmail(input);
    this.authService.sendCredentialsCookie(response, { accessToken, userId: user._id });

    return user;
  }

  @Mutation(() => UserOutput)
  async signUpWithGoogle(@Context('res') response: Response, @Args('input') input: TokenInput) {
    const { user, accessToken } = await this.authService.signUpWithGoogle(input);
    this.authService.sendCredentialsCookie(response, { accessToken, userId: user._id });

    return user;
  }

  @Query(() => UserOutput)
  async signInWithGoogle(
    @Context('res') response: Response,
    @Args('input') input: TokenInput,
  ): Promise<UserOutput> {
    const { user, accessToken } = await this.authService.signInWithGoogle(input);
    this.authService.sendCredentialsCookie(response, { accessToken, userId: user._id });

    return user;
  }

  @Query(() => String, { description: 'Verifies if credentials cookie has ben expired' })
  verifyExpiredCredentials(@Context('req') request: Request): String {
    const credentials = request.cookies['credentials'];

    if (!credentials) {
      return 'CREDENTIALS_EXPIRED';
    }

    return 'CREDENTIALS_NOT_EXPIRED';
  }

  @Query(() => String, { description: 'Get new credentials cookie' })
  async getNewCredential(
    @Context('res') response: Response,
    @Args('input') input: CredentialInput,
  ) {
    const accessToken = await this.authService.getNewAccessToken(input.userId);

    this.authService.sendCredentialsCookie(response, { accessToken, userId: input.userId });

    return 'CREDENTIAL_GENERATED';
  }
}
