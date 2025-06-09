import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
    constructor(private databaseService: DatabaseService) { }

    async saveMessage(dto: CreateMessageDto){
        return this.databaseService.message.create({
            data: {
                chatId: dto.chatId,
                senderId: dto.senderId,
                content: dto.content,
                sentAt: new Date(),
            },
        });
    }

    async getMessagesByChatId(chatId: string) {
        return this.databaseService.message.findMany({
            where: { chatId },
            orderBy: { sentAt: 'asc' },
        });
    }

    async getMessageById(messageId: string) {
        return this.databaseService.message.findUnique({
            where: { id: messageId },
        });
    }
}
