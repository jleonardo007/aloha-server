import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './entities/media.entity';
import { MediaService } from './media.service';
import { MediaResolver } from './media.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }])],
  providers: [MediaResolver, MediaService],
})
export class MediaModule {}
