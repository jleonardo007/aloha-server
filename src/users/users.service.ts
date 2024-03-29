import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserInput, /* UpdateUserInput */ GetUserInput } from './dto/user.input';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createNewUser(createUserInput: CreateUserInput): Promise<HydratedDocument<User>> {
    const user = await new this.userModel(createUserInput).save();
    return user;
  }

  async getUserByEmail(getUserInput: GetUserInput): Promise<HydratedDocument<User>> {
    const user = await this.userModel
      .findOne({ email: getUserInput.email })
      .populate({
        path: 'contacts',
        populate: {
          path: 'user',
          select: ['fullName', 'profilePicture', 'status', 'lastTimeConnected', 'isCloseAccount'],
          model: 'User',
        },
      })
      .populate('sentChats', {
        populate: {
          path: 'messages',
          model: 'Message',
        },
      })
      .populate('receivedChats', {
        populate: {
          path: 'messages',
          model: 'Message',
        },
      })
      .populate('sentCalls')
      .populate('receivedCalls')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found', {});
    }

    return user;
  }

  async getUser(id: string): Promise<HydratedDocument<User>> {
    return this.userModel.findById(id);
  }

  /*  updateUser(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  closeUserAccount(id: number) {
    return `This action removes a #${id} user`;
  } */
}
