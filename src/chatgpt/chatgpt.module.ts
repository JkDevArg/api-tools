import { Module } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { ChatgptController } from './chatgpt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatgpt } from './entities/chatgpt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chatgpt])],
  controllers: [ChatgptController],
  providers: [ChatgptService],
  exports: [ChatgptService]
})
export class ChatgptModule {}
