import { InputType, Field } from '@nestjs/graphql';
import { IsJWT, IsMongoId } from 'class-validator';

@InputType()
export class TokenInput {
  @Field(() => String)
  @IsJWT()
  tokenFromGoogle: string;
}

@InputType()
export class CredentialInput {
  @Field(() => String)
  @IsMongoId()
  userId: string;
}
