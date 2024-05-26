import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContactsModule } from './contacts/contacts.module';
import { MessagesModule } from './messages/messages.module';
import { MediaModule } from './media/media.module';
import { CallsModule } from './calls/calls.module';
import { GroupsModule } from './groups/groups.module';
import { ChatsModule } from './chats/chats.module';
import { AccessTokenGuard } from './guards/access-token-guard';
import database from './config/database';
import auth from './config/auth';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, auth],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req, res: req.res }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const dbUser = `${config.get<string>('db.user')}:${config.get<string>('db.password')}`;
        const dbHost = `${config.get<string>('db.host')}:${config.get<string>('db.port')}`;
        const dbName = config.get<string>('db.name');
        const dbCluster = config.get<string>('db.cluster');

        if (process.env.NODE_ENV === 'development') {
          return {
            uri: `mongodb://${dbUser}@${dbHost}/${dbName}`,
          };
        }

        return {
          uri: `mongodb+srv://${dbUser}${dbCluster}`,
        };
      },
    }),
    JwtModule.register({}),
    AuthModule,
    UsersModule,
    ContactsModule,
    MessagesModule,
    MediaModule,
    CallsModule,
    GroupsModule,
    ChatsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
