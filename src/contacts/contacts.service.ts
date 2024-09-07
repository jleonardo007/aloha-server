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

  async createContact(input: CreateContactInput): Promise<Contact> {
    const contactInfoFromDB = await this.userModel.findOne({ email: input.email }).exec();
    const { _id } = await new this.contactModel({
      ...input,
      createdBy: new mongo.ObjectId(input.createdBy),
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

  async updateContact(input: UpdateContactInput): Promise<Contact> {
    return this.contactModel.findByIdAndUpdate(input.id, {
      name: input.name,
    });
  }

  async deleteContact(input: DeleteContactInput) {
    return this.contactModel.findOneAndDelete({ _id: input.id });
  }

  async getUserContactList(input: GetContactInput) {
    return this.contactModel
      .find({
        createdBy: new mongo.ObjectId(input.id),
      })
      .populate({
        path: 'user',
        select: ['fullName', 'profilePicture', 'status', 'lastTimeConnected', 'isCloseAccount'],
        model: 'User',
      });
  }
}
