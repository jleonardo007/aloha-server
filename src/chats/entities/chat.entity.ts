import { ObjectType, Field, GraphQLISODateTime, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';

enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
}

registerEnumType(ChatType, {
  name: 'ChatType',
});

@ObjectType()
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Chat {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => ChatType)
  @Prop({
    type: String,
    enum: ChatType,
    required: true,
  })
  type: 'private' | 'group';

  @Field(() => [User])
  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  })
  members: User[];

  @Field(() => [Message], { defaultValue: [] })
  messages: Message[];

  // Fields saved when type=group
  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  groupPicture?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  groupName?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat',
});
