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
    default: '',
  })
  @Field(() => String, { nullable: true })
  password?: string;

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
  profilePicture?: string;

  @Prop({
    default: 'Available',
  })
  @Field(() => String)
  status: string;

  @Prop({
    default: false,
  })
  @Field(() => Boolean)
  isCloseAccount: boolean;

  @Prop({
    required: true,
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

  @Field(() => [Chat], { defaultValue: [] })
  chats: Chat[];

  @Field(() => [Call], { defaultValue: [] })
  calls: Call[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('contacts', {
  ref: 'Contact',
  localField: '_id',
  foreignField: 'createdBy',
});

UserSchema.virtual('chats', {
  ref: 'Chat',
  localField: '_id',
  foreignField: 'members',
  justOne: false,
});

UserSchema.virtual('calls', {
  ref: 'Call',
  localField: '_id',
  foreignField: 'members',
  justOne: false,
});
