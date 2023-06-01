import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { ContactsModule } from './contacts/contacts.module';
import { MessagesModule } from './messages/messages.module';
import { MediaModule } from './media/media.module';
import { CallsModule } from './calls/calls.module';
import { GroupsModule } from './groups/groups.module';
import database from './config/database';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb://${config.get<string>('DB_USER')}:${config.get<string>(
          'DB_PASSWORD',
        )}@${config.get<string>('DB_HOST')}:${config.get<string>('DB_PORT')}`,
      }),
    }),
    UsersModule,
    ContactsModule,
    MessagesModule,
    MediaModule,
    CallsModule,
    GroupsModule,
  ],
})
export class AppModule {}
