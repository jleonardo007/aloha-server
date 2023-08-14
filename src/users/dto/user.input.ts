import { InputType, Field, PickType } from '@nestjs/graphql';
import {
  IsString,
  IsAlphanumeric,
  MaxLength,
  IsOptional,
  IsUrl,
  IsEmail,
  MinLength,
  IsBoolean,
  IsMongoId,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @IsAlphanumeric()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  fullName: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  status?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isClosedAccount?: boolean;

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsOptional()
  profilePicture?: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @IsString()
  @IsMongoId()
  _id: string;
}

@InputType()
export class GetUserInput extends PickType(CreateUserInput, ['email', 'password']) {}
