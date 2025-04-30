import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

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

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.saveMessage(createMessageDto);
  }
}
