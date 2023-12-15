import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './entities/contact.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { ContactsService } from './contacts.service';
import { ContactsResolver } from './contacts.resolver';
import { JwtStrategy } from 'src/auth/passport-strategies/jwt.strategy';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ContactsResolver, ContactsService, JwtStrategy],
})
export class ContactsModule {}
