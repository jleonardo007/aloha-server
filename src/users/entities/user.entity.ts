import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Contact } from 'src/contacts/entities/contact.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { Call } from 'src/calls/entities/call.entity';
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
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    unique: true,
    required: true,
  })
  @Field(() => String)
  email: string;

  @Prop({
    minlength: 8,
  })
  @Field(() => String)
  password: string;

  @Prop({
    minlength: 1,
    maxlength: 60,
    required: true,
  })
  @Field(() => String)
  fullName: string;

  @Prop({
    default: '',
  })
  @Field(() => String, {
    nullable: true,
  })
  profilePicture: string;

  @Prop({
    default: 'Available',
  })
  @Field(() => String, {
    nullable: true,
  })
  status: string;

  @Prop({
    default: false,
  })
  @Field(() => Boolean)
  isCloseAccount: boolean;

  @Prop({
    default: '',
  })
  @Field(() => String)
  refreshToken: string;

  @Prop({
    default: Date.now(),
  })
  @Field(() => GraphQLISODateTime)
  lastTimeConnected: MongooseSchema.Types.Date;

  @Field(() => [Contact], { defaultValue: [] })
  contacts: Contact[];

  @Field(() => [Group], { defaultValue: [] })
  groups: Group[];

  @Field(() => [Chat], { defaultValue: [] })
  sentChats: Chat[];

  @Field(() => [Chat])
  receivedChats: Chat[];

  @Field(() => [Call], { defaultValue: [] })
  sentCalls: Call[];

  @Field(() => [Call])
  receivedCalls: Call[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('contacts', {
  ref: 'Contact',
  localField: '_id',
  foreignField: 'createdBy',
});

UserSchema.virtual('sentChats', {
  ref: 'Chat',
  localField: '_id',
  foreignField: 'sentBy',
});

UserSchema.virtual('receivedChats', {
  ref: 'Chat',
  localField: '_id',
  foreignField: 'receivedBy',
});

UserSchema.virtual('sentCalls', {
  ref: 'Call',
  localField: '_id',
  foreignField: 'sentBy',
});

UserSchema.virtual('receivedCalls', {
  ref: 'Call',
  localField: '_id',
  foreignField: 'receivedBy',
});
