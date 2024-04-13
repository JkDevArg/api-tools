import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { CreateChatgptDto } from './dto/create-chatgpt.dto';
import { UpdateChatgptDto } from './dto/update-chatgpt.dto';

@Controller('chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post()
  create(@Body() createChatgptDto: CreateChatgptDto) {
    return this.chatgptService.create(createChatgptDto);
  }
}
