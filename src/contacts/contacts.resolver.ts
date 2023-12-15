import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import {
  CreateContactInput,
  GetContactInput,
  UpdateContactInput,
  DeleteContactInput,
} from './dto/contact.input';
import { ContactOutput, ContactServiceResult } from './dto/contact.output';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Resolver(() => Contact)
export class ContactsResolver {
  constructor(private readonly contactsService: ContactsService) {}

  @Query(() => Contact)
  async getContact(@Args('getContactInput') getContactInput: GetContactInput): Promise<Contact> {
    return this.contactsService.getContact(getContactInput);
  }

  @Mutation(() => ContactOutput)
  async createContact(
    @Args('createContactInput') createContactInput: CreateContactInput,
  ): Promise<Contact> {
    return this.contactsService.createContact(createContactInput);
  }

  @Mutation(() => ContactServiceResult)
  async updateContact(
    @Args('updateContactInput') updateContactInput: UpdateContactInput,
  ): Promise<ContactServiceResult> {
    try {
      await this.contactsService.updateContact(updateContactInput);

      return {
        message: 'Contact updated succesfully!',
      };
    } catch (error) {
      return {
        message: 'Cannot update contact, please try later!',
      };
    }
  }

  @Mutation(() => ContactServiceResult)
  async deleteContact(
    @Args('deleteContactInput') deleteContactInput: DeleteContactInput,
  ): Promise<ContactServiceResult> {
    await this.contactsService.deleteContact(deleteContactInput);

    return {
      message: 'Contact deleted!',
    };
  }
}
