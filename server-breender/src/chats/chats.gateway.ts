import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway()
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinTeam')
  handleJoinTeam(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; teamId: string },
  ) {
    const { roomId, teamId } = data;
    const teamRoom = `${roomId}-${teamId}`;
    client.join(teamRoom);
    console.log(`Client ${client.id} joined room ${teamRoom}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: CreateMessageDto,
  ) {
    const message = await this.messageService.saveMessage(data);
    this.server.to(data.chatId).emit('receiveMessage', message);
  }
}
