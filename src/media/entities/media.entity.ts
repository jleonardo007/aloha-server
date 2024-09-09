import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum MediaType {
  IMAGE = 'image',
  'VOICE_NOTE' = 'voice-note',
}

registerEnumType(MediaType, { name: 'MediaType' });
@ObjectType()
@Schema()
export class Media {
  @Prop({ required: true })
  @Field(() => String)
  url: string;

  @Prop({ type: String, enum: MediaType, required: true })
  @Field(() => MediaType)
  type: MediaType;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
