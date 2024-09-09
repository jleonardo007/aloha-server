import { ObjectType, Field, OmitType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { Call } from 'src/calls/entities/call.entity';
@ObjectType()
export class UserOutput extends OmitType(User, ['password', 'refreshToken']) {
  @Field(() => [Chat])
  chats: Chat[];

  @Field(() => [Call])
  calls: Call[];
}
