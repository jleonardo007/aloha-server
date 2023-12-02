import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class Call {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  @Field(() => String)
  sentBy: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  @Field(() => String)
  receivedBy: MongooseSchema.Types.ObjectId;

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
