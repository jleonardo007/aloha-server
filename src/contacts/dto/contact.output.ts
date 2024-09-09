import { ObjectType, Field, PartialType, OmitType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
class PartialUser extends PartialType(
  OmitType(User, ['password', 'refreshToken', 'contacts', 'chats', 'calls']),
) {}

@ObjectType()
export class ContactOutput {
  @Field(() => String)
  _id: string;

  @Field(() => PartialUser, { nullable: true })
  user: PartialUser;

  @Field(() => String)
  createdBy: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;
}

@ObjectType()
export class ContactServiceResult {
  @Field(() => String)
  message: string;
}
