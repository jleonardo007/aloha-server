import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Call, CallSchema } from './entities/call.entity';
import { CallsService } from './calls.service';
import { CallsResolver } from './calls.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Call.name, schema: CallSchema }])],
  providers: [CallsResolver, CallsService],
})
export class CallsModule {}
