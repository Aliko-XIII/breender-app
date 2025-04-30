import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    // Optionally filter by userId in the future
    return this.chatsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.chatsService.findById(id);
  }

  @Post()
  createChat(@Body('userIds') userIds: string[]) {
    return this.chatsService.createChat(userIds);
  }

  @Get(':id/participants')
  getParticipants(@Param('id') id: string) {
    return this.chatsService.getParticipants(id);
  }

  @Get(':id/messages')
  getMessages(@Param('id') id: string) {
    return this.chatsService.getMessages(id);
  }
}
