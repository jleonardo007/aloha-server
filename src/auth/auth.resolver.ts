import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserInput, GetUserInput } from 'src/users/dto/user.input';
import { UserOutput } from 'src/users/dto/user.output';
import { TokenInput, GetNewTokenInput } from './dto/auth.input';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserOutput)
  async signUpWithEmail(@Args('signUpInput') signUpInput: CreateUserInput): Promise<UserOutput> {
    return await this.authService.signUpWithEmail(signUpInput);
  }

  @Query(() => UserOutput)
  @UseGuards(LocalAuthGuard)
  async signInWithEmail(@Args('signInInput') signInInput: GetUserInput) {
    return await this.authService.signInWithEmail(signInInput);
  }

  @Mutation(() => UserOutput)
  async signUpWithGoogle(@Args('tokenInput') tokenInput: TokenInput) {
    return await this.authService.signUpWithGoogle(tokenInput);
  }

  @Query(() => UserOutput)
  async signInWithGoogle(@Args('tokenInput') tokenInput: TokenInput): Promise<UserOutput> {
    return await this.authService.signInWithGoogle(tokenInput);
  }

  @Query(() => String)
  async getNewAccessToken(@Args('getNewTokenInput') getNewTokenInput: GetNewTokenInput) {
    return await this.authService.getNewAccessToken(getNewTokenInput);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async getNewRefreshToken(@Args('getNewTokenInput') getNewTokenInput: GetNewTokenInput) {
    return await this.authService.getNewRefreshToken(getNewTokenInput);
  }
}
