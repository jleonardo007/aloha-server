import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCallInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
