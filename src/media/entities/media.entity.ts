import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class Media {
  @Prop({
    default: '',
  })
  @Field(() => String)
  url: string;

  @Prop({
    default: '',
  })
  @Field(() => String)
  type: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
