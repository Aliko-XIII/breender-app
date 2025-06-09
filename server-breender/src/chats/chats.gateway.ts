import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({ cors: true })
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log('WebSocket client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('WebSocket client disconnected:', client.id);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    const { chatId } = data;
    client.join(chatId);
    console.log(`Client ${client.id} joined chat ${chatId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: CreateMessageDto,
  ) {
    console.log('Received sendMessage:', data);
    const message = await this.messageService.saveMessage(data);
    this.server.to(data.chatId).emit('receiveMessage', message);
  }
}
