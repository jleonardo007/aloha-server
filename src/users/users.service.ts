import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Model } from 'mongoose';
import { NOT_FOUND } from 'src/errors';
import { User } from './entities/user.entity';
import { CreateUserInput, /* UpdateUserInput */ GetUserInput } from './dto/user.input';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createNewUser(input: CreateUserInput): Promise<HydratedDocument<User>> {
    const user = await new this.userModel(input).save();
    return user;
  }

  async getUserByEmail(input: GetUserInput): Promise<HydratedDocument<User>> {
    const user = await this.userModel
      .findOne({ email: input.email })
      .populate({
        path: 'contacts',
        populate: {
          path: 'user',
          select: ['fullName', 'profilePicture', 'status', 'lastTimeConnected', 'isCloseAccount'],
          model: 'User',
        },
      })
      .populate({
        path: 'calls',
        options: {
          sort: {
            createdAt: -1,
          },
        },
      })
      .populate({
        path: 'chats',
        options: {
          sort: {
            createdAt: -1,
          },
        },
        populate: {
          path: 'messages',
          options: {
            sort: {
              createAt: -1,
            },
            limit: 30,
          },
        },
      })
      .exec();

    if (!user) {
      throw new NotFoundException(NOT_FOUND.MESSAGE, {
        description: NOT_FOUND.DESCRIPTION.USER_NOT_FOUND,
      });
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
