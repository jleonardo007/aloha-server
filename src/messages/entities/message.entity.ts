import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { MediaSchema, Media } from 'src/media/entities/media.entity';

@Schema()
@ObjectType()
class Content {
  @Prop({ type: String, required: true })
  @Field(() => String, { defaultValue: '' })
  text: string;

  @Prop({
    type: MediaSchema,
  })
  @Field(() => Media, { nullable: true })
  media?: Media;
}

const ContentSchema = SchemaFactory.createForClass(Content);

@ObjectType()
@Schema()
export class Message {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  })
  @Field(() => String)
  chat: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  @Field(() => [User], { description: 'Users that receive the message' })
  to: User[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  @Field(() => User, { description: 'User that sends the message' })
  from: User;

  @Prop({ type: MongooseSchema.Types.Date, required: true })
  @Field(() => GraphQLISODateTime)
  sentAt: MongooseSchema.Types.Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true })
  @Field(() => GraphQLISODateTime)
  receivedAt: MongooseSchema.Types.Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  @Field(() => Boolean, { defaultValue: false })
  isRead: boolean;

  @Prop({
    type: [String],
    default: [],
  })
  @Field(() => [String], { description: 'User ids that read the message', defaultValue: [] })
  readBy: [string];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message' })
  @Field(() => Message, { nullable: true })
  replyTo?: Message;

  @Prop({ type: ContentSchema, required: true })
  @Field(() => Content)
  content: Content;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
