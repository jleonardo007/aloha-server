import { Injectable } from '@nestjs/common';
import { CreateContactInput } from './dto/create-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';

@Injectable()
export class ContactsService {
  create(createContactInput: CreateContactInput) {
    console.log(createContactInput);
    return 'This action adds a new contact';
  }

  findAll() {
    return `This action returns all contacts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contact`;
  }

  update(id: number, updateContactInput: UpdateContactInput) {
    console.log(updateContactInput);
    return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
