import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChatsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.chat.findMany({
      include: { participants: true, messages: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.databaseService.chat.findUnique({
      where: { id },
      include: { participants: true, messages: true },
    });
  }

  async createChat(userIds: string[]) {
    return this.databaseService.chat.create({
      data: {
        participants: {
          create: userIds.map(userId => ({ userId }))
        }
      },
      include: { participants: true },
    });
  }

  async getParticipants(chatId: string) {
    return this.databaseService.chatParticipant.findMany({
      where: { chatId },
      include: { user: true },
    });
  }

  async getMessages(chatId: string) {
    return this.databaseService.message.findMany({
      where: { chatId },
      orderBy: { sentAt: 'asc' },
    });
  }
}
