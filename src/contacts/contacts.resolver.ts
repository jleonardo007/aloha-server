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

  @Query(() => ContactOutput)
  async getContact(@Args('input') input: GetContactInput): Promise<Contact> {
    return this.contactsService.getContact(input);
  }

  @Query(() => [ContactOutput])
  async getUserContactsList(@Args('input') input: GetContactInput) {
    return this.contactsService.getUserContactList(input);
  }

  @Mutation(() => ContactOutput)
  async createContact(@Args('input') input: CreateContactInput): Promise<Contact> {
    return this.contactsService.createContact(input);
  }

  @Mutation(() => ContactServiceResult)
  async updateContact(@Args('input') input: UpdateContactInput): Promise<ContactServiceResult> {
    try {
      await this.contactsService.updateContact(input);

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
  async deleteContact(@Args('input') input: DeleteContactInput): Promise<ContactServiceResult> {
    await this.contactsService.deleteContact(input);

    return {
      message: 'Contact deleted!',
    };
  }
}
