import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Call } from 'src/calls/entities/call.entity';

@ObjectType()
@Schema({
  timestamps: true,
})
export class Contact {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  @Field(() => User)
  contactInfo: User;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  })
  @Field(() => [Message])
  messages: [Message];

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Call',
      },
    ],
  })
  @Field(() => [Call])
  calls: [Call];

  @Prop({
    minlength: 1,
    maxlength: 60,
  })
  @Field(() => String, {
    nullable: true,
  })
  name: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
