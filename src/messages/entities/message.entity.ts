import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Media } from 'src/media/entities/media.entity';

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
    type: MongooseSchema.Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  @Field(() => String, { description: 'User that sends chat' })
  group: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  @Field(() => [User], { description: 'Users that receive the message' })
  to: [User];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  @Field(() => User, { description: 'User that sends the message' })
  from: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Media',
  })
  @Field(() => Media)
  media: Media;

  @Prop()
  @Field(() => String, {
    description: 'Message replied id',
  })
  repliedTo: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  @Field(() => User)
  deletedBy: User;

  @Prop()
  @Field(() => GraphQLISODateTime)
  sentAt: MongooseSchema.Types.Date;

  @Prop()
  @Field(() => GraphQLISODateTime)
  receivedAt: MongooseSchema.Types.Date;

  @Prop()
  @Field(() => String)
  textContent: string;

  @Prop({
    default: false,
  })
  @Field(() => Boolean)
  hasMedia: boolean;

  @Prop({
    default: false,
  })
  @Field(() => Boolean)
  isRead: boolean;

  @Prop([String])
  @Field(() => [String], { description: 'User ids that read the message' })
  readBy: [string];

  @Prop({
    default: false,
  })
  @Field(() => Boolean)
  isDeleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
