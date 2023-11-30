import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { Message } from 'src/messages/entities/message.entity';

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

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Field(() => String)
  sentBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Field(() => String)
  receivedBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Field(() => GraphQLISODateTime)
  lastMessageTime: MongooseSchema.Types.Date;

  @Field(() => [Message], { defaultValue: [] })
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat',
});
