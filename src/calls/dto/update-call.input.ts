import { CreateCallInput } from './create-call.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCallInput extends PartialType(CreateCallInput) {
  @Field(() => Int)
  id: number;
}
