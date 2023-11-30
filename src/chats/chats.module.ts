import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])],
  providers: [ChatsResolver, ChatsService],
})
export class ChatsModule {}
