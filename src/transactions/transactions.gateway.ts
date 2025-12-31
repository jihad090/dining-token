
import { 
  WebSocketGateway, WebSocketServer, SubscribeMessage, 
  OnGatewayConnection, OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: {
   origin: '*',
   credentials: false
  },
  transports: ['websocket', 'polling'],
 })
export class TransactionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

 handleConnection(client: Socket) {
    console.log(`⚡️ Physical Connection Established: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinUserRoom')

  handleUserJoin(client: Socket, userId: string) {
    console.log(`🔌 Client ${client.id} joining room: user_${userId}`); 
    client.join(`user_${userId}`);
  }

notifyManagersNewRequest(data: any) {
    this.server.to('manager_room').emit('new_payment_request', data);
   }

  // 1. Buy Request Notification
  notifySellerOfRequest(sellerId: string, data: any) {
    this.server.to(`user_${sellerId}`).emit('buy_request_notification', data);
  }

  // 2. Payment Status Update
  notifyUserStatusUpdate(userId: string, data: any) {
    console.log(`🚀 SOCKET EMIT: sending 'payment_status_updated' to ROOM: user_${userId}`);
    this.server.to(`user_${userId}`).emit('payment_status_updated', data);
  }

  // 3. Chat Message Notification 
  notifyChatMessage(userId: string, data: any) {
    this.server.to(`user_${userId}`).emit('receive_chat_message', data);
  }

  // 4. Transfer Complete Notification 
  notifyTransferComplete(userId: string, data: any) {
    this.server.to(`user_${userId}`).emit('token_transfer_completed', data);
  }
  notifyBuyer(buyerId: string, data: any) {
    this.server.to(`user_${buyerId}`).emit('buyer_notification', data);
  }
}