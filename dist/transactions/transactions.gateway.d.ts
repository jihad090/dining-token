import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class TransactionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleManagerJoin(client: Socket): void;
    handleUserJoin(client: Socket, userId: string): void;
    notifyManagersNewRequest(data: any): void;
    notifyUserStatusUpdate(userId: string, data: any): void;
}
