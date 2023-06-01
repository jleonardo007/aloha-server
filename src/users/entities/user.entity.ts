import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Contact } from 'src/contacts/entities/contact.entity';
import { Group } from 'src/groups/entities/group.entity';

@ObjectType()
@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    unique: true,
    required: true,
  })
  @Field(() => String)
  email: string;

  @Prop({
    required: true,
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
    default: '',
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

  @Prop()
  @Field(() => GraphQLISODateTime)
  lastTimeConnected: MongooseSchema.Types.Date;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Contact',
      },
    ],
  })
  @Field(() => [Contact])
  contacts: [Contact];

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Group',
      },
    ],
  })
  @Field(() => [Group])
  groups: [Group];
}

export const UserSchema = SchemaFactory.createForClass(User);
