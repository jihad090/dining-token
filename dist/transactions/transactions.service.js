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
let TransactionsService = class TransactionsService {
    constructor(trxModel, diningTokenService) {
        this.trxModel = trxModel;
        this.diningTokenService = diningTokenService;
    }
    async createOrder(userId, createTrxDto) {
        const existingTrx = await this.trxModel.findOne({ trxId: createTrxDto.trxId });
        if (existingTrx) {
            throw new common_1.ConflictException('This Transaction ID is already used!');
        }
        const newTrx = new this.trxModel(Object.assign(Object.assign({ userId: new mongoose_2.Types.ObjectId(userId) }, createTrxDto), { status: 'PENDING' }));
        return await newTrx.save();
    }
    async getPendingTransactions() {
        return this.trxModel.find({ status: 'PENDING' })
            .populate('userId', 'name email id')
            .sort({ createdAt: -1 })
            .exec();
    }
    async approveTransaction(trxId, managerId) {
        const transaction = await this.trxModel.findById(trxId);
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (transaction.status === 'APPROVED')
            throw new common_1.BadRequestException('Already Approved');
        await this.diningTokenService.issueTokens(transaction.userId.toString(), transaction.daysCount, transaction._id.toString());
        transaction.status = 'APPROVED';
        transaction.approvedBy = new mongoose_2.Types.ObjectId(managerId);
        return await transaction.save();
    }
    async rejectTransaction(trxId, managerId) {
        const transaction = await this.trxModel.findById(trxId);
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (transaction.status !== 'PENDING') {
            throw new common_1.BadRequestException('Transaction is already processed (Approved/Rejected)');
        }
        transaction.status = 'REJECTED';
        transaction.approvedBy = new mongoose_2.Types.ObjectId(managerId);
        return await transaction.save();
    }
    async getTransactionHistory() {
        return this.trxModel.find({ status: { $ne: 'PENDING' } })
            .populate('userId', 'name email id')
            .sort({ updatedAt: -1 })
            .limit(20)
            .exec();
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        dining_token_service_1.DiningTokenService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map