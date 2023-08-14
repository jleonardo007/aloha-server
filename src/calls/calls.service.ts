import { Injectable } from '@nestjs/common';
import { CreateCallInput } from './dto/create-call.input';
import { UpdateCallInput } from './dto/update-call.input';

@Injectable()
export class CallsService {
  create(createCallInput: CreateCallInput) {
    console.log(createCallInput);
    return 'This action adds a new call';
  }

  findAll() {
    return `This action returns all calls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} call`;
  }

  update(id: number, updateCallInput: UpdateCallInput) {
    console.log(updateCallInput);
    return `This action updates a #${id} call`;
  }

  remove(id: number) {
    return `This action removes a #${id} call`;
  }
}
