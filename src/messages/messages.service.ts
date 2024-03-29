import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';

@Injectable()
export class MessagesService {
  create(createMessageInput: CreateMessageInput) {
    console.log(createMessageInput);
    return 'This action adds a new message';
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageInput: UpdateMessageInput) {
    console.log(updateMessageInput);
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
