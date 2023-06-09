import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserInput, GetUserInput } from 'src/users/dto/user.input';
import { UserOutput } from 'src/users/dto/user.output';
import { LocalAuthGuard } from './guards/local';
import { JwtAuthGuard } from './guards/jwt';
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

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async getNewAccessToken(@Args('userId') userId: string) {
    return await this.authService.generateNewAccessToken(userId);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async getNewRefreshToken(@Args('userId') userId: string) {
    return await this.authService.generateNewRefreshToken(userId);
  }
}
