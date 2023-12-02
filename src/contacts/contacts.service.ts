import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { Contact } from './entities/contact.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateContactInput,
  GetContactInput,
  UpdateContactInput,
  DeleteContactInput,
} from './dto/contact.input';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private readonly contactModel: Model<Contact>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createContact(createContactInput: CreateContactInput): Promise<Contact> {
    const contactInfoFromDB = await this.userModel
      .findOne({ email: createContactInput.email })
      .exec();
    const { _id } = await new this.contactModel({
      ...createContactInput,
      createdBy: new mongo.ObjectId(createContactInput.createdBy),
      user: contactInfoFromDB && contactInfoFromDB._id,
    }).save();

    return this.contactModel
      .findById(_id)
      .populate({
        path: 'user',
        select: ['fullName', 'profilePicture', 'status', 'lastTimeConnected', 'isCloseAccount'],
      })
      .exec();
  }

  async getContact({ id }: GetContactInput) {
    return this.contactModel
      .findById(id)
      .populate('user', [
        'fullName',
        'profilePicture',
        'status',
        'lastTimeConnected',
        'isCloseAccount',
      ])
      .exec();
  }

  async updateContact(updateContactInput: UpdateContactInput): Promise<Contact> {
    return this.contactModel.findByIdAndUpdate(updateContactInput.id, {
      name: updateContactInput.name,
    });
  }

  async deleteContact(deleteContactInput: DeleteContactInput) {
    return this.contactModel.findOneAndDelete({ _id: deleteContactInput.id });
  }
}
