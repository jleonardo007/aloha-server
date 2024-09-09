import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Schema()
export class Call {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => [User])
  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  })
  members: User[];

  @Prop({ type: MongooseSchema.Types.Date, required: true })
  @Field(() => GraphQLISODateTime)
  startedAt: MongooseSchema.Types.Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true })
  @Field(() => GraphQLISODateTime)
  finishedAt: MongooseSchema.Types.Date;

  @Prop({
    type: String,
    required: true,
  })
  @Field(() => String)
  duration: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  @Field(() => Boolean)
  isMissed: boolean;
}

export const CallSchema = SchemaFactory.createForClass(Call);
