"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let TransactionsGateway = class TransactionsGateway {
    handleConnection(client) {
    }
    handleDisconnect(client) {
    }
    handleManagerJoin(client) {
        client.join('manager_room');
    }
    handleUserJoin(client, userId) {
        client.join(`user_${userId}`);
    }
    notifyManagersNewRequest(data) {
        this.server.to('manager_room').emit('new_payment_request', data);
    }
    notifyUserStatusUpdate(userId, data) {
        this.server.to(`user_${userId}`).emit('payment_status_updated', data);
    }
};
exports.TransactionsGateway = TransactionsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TransactionsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinManagerRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TransactionsGateway.prototype, "handleManagerJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinUserRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], TransactionsGateway.prototype, "handleUserJoin", null);
exports.TransactionsGateway = TransactionsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], TransactionsGateway);
//# sourceMappingURL=transactions.gateway.js.map