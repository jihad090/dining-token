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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const auth_guard_1 = require("../auth/auth.guard");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async createOrder(req, body) {
        return this.transactionsService.createOrder(req.user.sub, body);
    }
    async getMyHistory(req) {
        return this.transactionsService.getUserTransactions(req.user.sub);
    }
    async approveOrder(req, id) {
        if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
            throw new common_1.UnauthorizedException('Access Denied: Only Managers Allowed');
        }
        return this.transactionsService.approveTransaction(id, req.user.sub);
    }
    async rejectOrder(req, id) {
        if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
            throw new common_1.UnauthorizedException('Access Denied');
        }
        return this.transactionsService.rejectTransaction(id, req.user.sub);
    }
    async getHistory(req) {
        if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
            throw new common_1.UnauthorizedException('Access Denied: Only Managers Allowed');
        }
        return this.transactionsService.getTransactionHistory(req.user.hallName);
    }
    async getPending(req) {
        if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
            throw new common_1.UnauthorizedException('Access Denied: Only Managers Allowed');
        }
        return this.transactionsService.getPendingTransactions(req.user.hallName);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)('purchase'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('my-history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getMyHistory", null);
__decorate([
    (0, common_1.Post)('approve/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "approveOrder", null);
__decorate([
    (0, common_1.Post)('reject/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "rejectOrder", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getPending", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map