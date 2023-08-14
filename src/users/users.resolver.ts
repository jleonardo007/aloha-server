import { Resolver, Query /* Mutation, Args, Int */ } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
/* import { UpdateUserInput } from './dto/user.input'; */

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {}

  /*  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {}

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {}

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {} */
}
