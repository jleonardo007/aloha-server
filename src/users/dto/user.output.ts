import { ObjectType, OmitType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
@ObjectType()
export class UserOutput extends OmitType(User, ['password', 'refreshToken']) {}
