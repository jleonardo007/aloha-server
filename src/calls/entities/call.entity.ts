import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Schema()
export class Call {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  @Field(() => User)
  startedBy: User;

  @Prop()
  @Field(() => GraphQLISODateTime)
  startedAt: MongooseSchema.Types.Date;

  @Prop()
  @Field(() => GraphQLISODateTime)
  finishedAt: MongooseSchema.Types.Date;

  @Prop({
    default: '',
  })
  @Field(() => String)
  duration: string;

  @Prop({
    default: false,
  })
  @Field(() => Boolean)
  isMissed: boolean;
}

export const CallSchema = SchemaFactory.createForClass(Call);
