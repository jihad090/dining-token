import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

//main geteway for real tiem notifications
@WebSocketGateway({
  cors: {
    origin: '*', //access from anywhere
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false
  },
  transports: ['websocket', 'polling'],
})
export class TransactionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
  }

  handleDisconnect(client: Socket) {
  }

  @SubscribeMessage('joinManagerRoom')
  handleManagerJoin(client: Socket) {
    client.join('manager_room');
  }

  @SubscribeMessage('joinUserRoom')
  handleUserJoin(client: Socket, userId: string) {
    client.join(`user_${userId}`);
  }

  notifyManagersNewRequest(data: any) {
    this.server.to('manager_room').emit('new_payment_request', data);
  }

  notifyUserStatusUpdate(userId: string, data: any) {
    this.server.to(`user_${userId}`).emit('payment_status_updated', data);
  }
}