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
exports.DiningTokenSchema = exports.DiningToken = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DiningToken = class DiningToken {
};
exports.DiningToken = DiningToken;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DiningToken.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DiningToken.prototype, "originalBuyerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], DiningToken.prototype, "tokenID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], DiningToken.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Lunch', 'Dinner'] }),
    __metadata("design:type", String)
], DiningToken.prototype, "mealType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['Active', 'Used', 'Expired', 'Listed_For_Sale', 'Sold'],
        default: 'Active',
        index: true
    }),
    __metadata("design:type", String)
], DiningToken.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], DiningToken.prototype, "resalePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                fromUser: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                toUser: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                date: Date,
                price: Number
            }],
        default: []
    }),
    __metadata("design:type", Array)
], DiningToken.prototype, "transferHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], DiningToken.prototype, "scannedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DiningToken.prototype, "scannedBy", void 0);
exports.DiningToken = DiningToken = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DiningToken);
exports.DiningTokenSchema = mongoose_1.SchemaFactory.createForClass(DiningToken);
exports.DiningTokenSchema.index({ ownerId: 1, date: 1, mealType: 1 }, { unique: true });
//# sourceMappingURL=dining-token.schema.js.map