import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './entities/group.entity';
import { GroupsService } from './groups.service';
import { GroupsResolver } from './groups.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])],
  providers: [GroupsResolver, GroupsService],
})
export class GroupsModule {}
