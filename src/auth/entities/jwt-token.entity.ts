import { Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({
  timestamps: true,
})
export class JsonWebToken {
  @Field(() => String)
  _id: MongooseSchema.Types.String;

  @Prop({
    required: true,
  })
  @Field(() => String)
  value: string;

  @Prop({
    required: true,
    enum: ['access', 'refresh'],
  })
  @Field(() => String)
  type: string;
}

export const JsonWebTokenSchema = SchemaFactory.createForClass(JsonWebToken);
