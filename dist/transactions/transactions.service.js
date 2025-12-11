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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("./schemas/transaction.schema");
const dining_token_service_1 = require("../dining-token/dining-token.service");
const transactions_gateway_1 = require("./transactions.gateway");
let TransactionsService = class TransactionsService {
    constructor(trxModel, diningTokenService, transactionsGateway) {
        this.trxModel = trxModel;
        this.diningTokenService = diningTokenService;
        this.transactionsGateway = transactionsGateway;
    }
    async createOrder(userId, createTrxDto) {
        const existingTrx = await this.trxModel.findOne({ trxId: createTrxDto.trxId });
        if (existingTrx) {
            throw new common_1.ConflictException('This Transaction ID is already used!');
        }
        const newTrx = new this.trxModel(Object.assign(Object.assign({ userId: new mongoose_2.Types.ObjectId(userId) }, createTrxDto), { status: 'PENDING' }));
        const savedTrx = await newTrx.save();
        const populatedTrx = await savedTrx.populate('userId', 'name email id');
        this.transactionsGateway.notifyManagersNewRequest(populatedTrx);
        return savedTrx;
    }
    async getPendingTransactions(hallName) {
        const allPending = await this.trxModel.find({ status: 'PENDING' })
            .populate('userId', 'name email hallName')
            .sort({ createdAt: -1 })
            .exec();
        return allPending.filter((trx) => trx.userId && trx.userId.hallName === hallName);
    }
    async approveTransaction(trxId, managerId) {
        const transaction = await this.trxModel.findOneAndUpdate({ _id: trxId, status: 'PENDING' }, {
            $set: {
                status: 'APPROVED',
                approvedBy: new mongoose_2.Types.ObjectId(managerId),
                updatedAt: new Date()
            }
        }, { new: true }).populate('userId');
        if (!transaction) {
            const exists = await this.trxModel.findById(trxId);
            if (!exists)
                throw new common_1.NotFoundException('Transaction not found');
            throw new common_1.ConflictException('Transaction already processed by another manager!');
        }
        await this.diningTokenService.issueTokens(transaction.userId._id.toString(), transaction.daysCount, transaction._id.toString());
        this.transactionsGateway.notifyUserStatusUpdate(transaction.userId._id.toString(), {
            status: 'Approved',
            message: 'Your meal plan request has been Approved!',
            trxId: transaction.trxId
        });
        return transaction;
    }
    async rejectTransaction(trxId, managerId) {
        const transaction = await this.trxModel.findOneAndUpdate({ _id: trxId, status: 'PENDING' }, {
            $set: {
                status: 'REJECTED',
                approvedBy: new mongoose_2.Types.ObjectId(managerId),
                updatedAt: new Date()
            }
        }, { new: true }).populate('userId');
        if (!transaction) {
            const exists = await this.trxModel.findById(trxId);
            if (!exists)
                throw new common_1.NotFoundException('Transaction not found');
            throw new common_1.ConflictException('Transaction already processed by another manager!');
        }
        this.transactionsGateway.notifyUserStatusUpdate(transaction.userId._id.toString(), {
            status: 'Rejected',
            message: 'Your request was Rejected.',
            trxId: transaction.trxId
        });
        return transaction;
    }
    async getTransactionHistory(hallName) {
        const allTransactions = await this.trxModel.find({ status: { $ne: 'PENDING' } })
            .populate('userId', 'name email hallName')
            .sort({ updatedAt: -1 })
            .exec();
        return allTransactions.filter((trx) => trx.userId && trx.userId.hallName === hallName);
    }
    async getUserTransactions(userId) {
        return this.trxModel.find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        dining_token_service_1.DiningTokenService,
        transactions_gateway_1.TransactionsGateway])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map