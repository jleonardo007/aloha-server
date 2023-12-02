import { ObjectType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Schema({
  timestamps: true,
})
export class Contact {
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  @Field(() => String)
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  @Field(() => User, { nullable: true })
  user: Types.ObjectId;

  @Prop({
    minlength: 1,
    maxlength: 60,
    required: true,
  })
  @Field(() => String)
  name: string;

  @Prop({
    unique: true,
    required: true,
  })
  @Field(() => String)
  email: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
