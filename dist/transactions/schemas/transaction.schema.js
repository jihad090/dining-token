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
exports.TransactionSchema = exports.Transaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Transaction = class Transaction {
};
exports.Transaction = Transaction;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Transaction.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Transaction.prototype, "bkashNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Transaction.prototype, "trxId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['15_days', '30_days', 'rest_month'] }),
    __metadata("design:type", String)
], Transaction.prototype, "packageType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "daysCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
        index: true
    }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Transaction.prototype, "approvedBy", void 0);
exports.Transaction = Transaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Transaction);
exports.TransactionSchema = mongoose_1.SchemaFactory.createForClass(Transaction);
exports.TransactionSchema.index({ status: 1, createdAt: -1 });
//# sourceMappingURL=transaction.schema.js.map