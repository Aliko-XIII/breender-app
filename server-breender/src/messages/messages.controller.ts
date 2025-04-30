import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('chat/:chatId')
  getMessagesByChatId(@Param('chatId') chatId: string) {
    return this.messagesService.getMessagesByChatId(chatId);
  }

  @Get(':id')
  getMessageById(@Param('id') id: string) {
    return this.messagesService.getMessageById(id);
  }
}
