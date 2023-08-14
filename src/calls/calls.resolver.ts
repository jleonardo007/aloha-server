import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CallsService } from './calls.service';
import { Call } from './entities/call.entity';
import { CreateCallInput } from './dto/create-call.input';
import { UpdateCallInput } from './dto/update-call.input';

@Resolver(() => Call)
export class CallsResolver {
  constructor(private readonly callsService: CallsService) {}

  @Mutation(() => Call)
  createCall(@Args('createCallInput') createCallInput: CreateCallInput) {
    return this.callsService.create(createCallInput);
  }

  @Query(() => [Call], { name: 'calls' })
  findAll() {
    return this.callsService.findAll();
  }

  @Query(() => Call, { name: 'call' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.callsService.findOne(id);
  }

  @Mutation(() => Call)
  updateCall(@Args('updateCallInput') updateCallInput: UpdateCallInput) {
    return this.callsService.update(updateCallInput.id, updateCallInput);
  }

  @Mutation(() => Call)
  removeCall(@Args('id', { type: () => Int }) id: number) {
    return this.callsService.remove(id);
  }
}
