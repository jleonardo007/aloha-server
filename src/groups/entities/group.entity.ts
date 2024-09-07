import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';

@ObjectType()
@Schema({
  timestamps: true,
})
export class Group {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  @Field(() => User)
  createdBy: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  @Field(() => User)
  updatedBy: User;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  @Field(() => [User])
  members: [User];

  @Prop({
    minlength: 5,
    maxlength: 60,
  })
  @Field(() => String)
  name: string;

  @Prop({
    default: '',
  })
  @Field(() => String, {
    nullable: true,
  })
  picture: string;

  @Field(() => [Message], { defaultValue: [] })
  messages: [Message];
}

export const GroupSchema = SchemaFactory.createForClass(Group);

GroupSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'group',
});
