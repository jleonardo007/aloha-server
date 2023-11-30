import { ObjectType, Field, OmitType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { Call } from 'src/calls/entities/call.entity';
@ObjectType()
export class UserOutput extends OmitType(User, [
  'password',
  'refreshToken',
  'sentChats',
  'receivedChats',
  'sentCalls',
  'receivedCalls',
]) {
  @Field(() => String)
  accessToken: string;

  @Field(() => [Chat])
  chats: Chat[];

  @Field(() => [Call])
  calls: Call[];
}
