import { InputType, Field } from '@nestjs/graphql';
import { IsJWT } from 'class-validator';

@InputType()
export class TokenInput {
  @Field(() => String)
  @IsJWT()
  tokenFromGoogle: string;
}
