import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { MessagesModule } from '../messages/messages.module';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [MessagesModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
  exports: [ChatsService],
})
export class ChatsModule {}
