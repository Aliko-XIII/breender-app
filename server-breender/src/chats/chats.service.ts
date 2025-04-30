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
    // Check for existing chat with exactly these participants
    const existingChats = await this.databaseService.chat.findMany({
      where: {
        participants: {
          every: {
            userId: { in: userIds }
          },
        },
      },
      include: { participants: true },
    });
    // Filter for chats with exactly the same number of participants
    const chat = existingChats.find(c => c.participants.length === userIds.length &&
      userIds.every(uid => c.participants.some(p => p.userId === uid)));
    if (chat) return chat;

    // Create chat and participants
    const newChat = await this.databaseService.chat.create({
      data: {},
    });

    // Get existing participants for this chat (should be empty, but for safety)
    const existingParticipants = await this.databaseService.chatParticipant.findMany({
      where: { chatId: newChat.id },
    });
    const existingUserIds = new Set(existingParticipants.map(p => p.userId));

    // Only create participants for users not already in the chat
    await Promise.all(
      userIds
        .filter(userId => !existingUserIds.has(userId))
        .map(userId =>
          this.databaseService.chatParticipant.create({
            data: { chatId: newChat.id, userId },
          })
        )
    );

    return this.databaseService.chat.findUnique({
      where: { id: newChat.id },
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
