import { InputType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { IsString, IsEmail, MaxLength, MinLength, IsMongoId } from 'class-validator';

@InputType()
export class CreateContactInput {
  @Field(() => String)
  @IsMongoId()
  createdBy: Types.ObjectId;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  name: string;

  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;
}

@InputType()
export class GetContactInput {
  @IsMongoId()
  @Field(() => String)
  id: string;
}

@InputType()
export class UpdateContactInput {
  @IsMongoId()
  @Field(() => String)
  id: string;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  name: string;
}

@InputType()
export class DeleteContactInput {
  @IsMongoId()
  @Field(() => String)
  id: string;
}
