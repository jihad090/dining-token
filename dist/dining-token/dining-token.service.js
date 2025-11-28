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
exports.DiningTokenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dining_token_schema_1 = require("./schemas/dining-token.schema");
let DiningTokenService = class DiningTokenService {
    constructor(diningTokenModel) {
        this.diningTokenModel = diningTokenModel;
    }
    async issueTokens(userId, days, transactionId) {
        const tokensToInsert = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + 1);
        const shortUserId = userId.slice(-7).toUpperCase();
        for (let i = 0; i < days; i++) {
            const activeDate = new Date(startDate);
            activeDate.setDate(startDate.getDate() + i);
            const randL = Math.floor(100000 + Math.random() * 900000);
            tokensToInsert.push({
                ownerId: new mongoose_2.Types.ObjectId(userId),
                originalBuyerId: new mongoose_2.Types.ObjectId(userId),
                date: activeDate,
                mealType: 'Lunch',
                tokenID: `${shortUserId}-L-${randL}`,
                status: 'Active'
            });
            const randD = Math.floor(100000 + Math.random() * 900000);
            tokensToInsert.push({
                ownerId: new mongoose_2.Types.ObjectId(userId),
                originalBuyerId: new mongoose_2.Types.ObjectId(userId),
                date: activeDate,
                mealType: 'Dinner',
                tokenID: `${shortUserId}-D-${randD}`,
                status: 'Active'
            });
        }
        if (tokensToInsert.length > 0) {
            await this.diningTokenModel.insertMany(tokensToInsert);
        }
        return { message: `${tokensToInsert.length} tokens generated successfully` };
    }
    async scanToken(tokenID, diningBoyId) {
        const token = await this.diningTokenModel.findOne({ tokenID });
        if (!token)
            throw new common_1.NotFoundException('Invalid Token! QR Code not match.');
        const now = new Date();
        const tokenDate = new Date(token.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        tokenDate.setHours(0, 0, 0, 0);
        if (token.status === 'Used') {
            throw new common_1.ConflictException('WARNING: Token ALREADY USED!');
        }
        if (token.status === 'Expired') {
            throw new common_1.BadRequestException('Token is EXPIRED!');
        }
        if (tokenDate < today) {
            throw new common_1.BadRequestException('Token Date is past! EXPIRED.');
        }
        if (tokenDate > today) {
            throw new common_1.BadRequestException(`Not Active Yet! Valid for ${tokenDate.toDateString()}.`);
        }
        const currentHour = now.getHours();
        let isValidTime = false;
        if (token.mealType === 'Lunch') {
            if (currentHour >= 13 && currentHour < 15) {
                isValidTime = true;
            }
            else {
                throw new common_1.BadRequestException('Lunch meal time (1PM - 3PM) is over or not started!');
            }
        }
        else if (token.mealType === 'Dinner') {
            if (currentHour >= 21 && currentHour < 23) {
                isValidTime = true;
            }
            else {
                throw new common_1.BadRequestException('Dinner meal time (9PM - 11PM) is over or not started!');
            }
        }
        if (isValidTime) {
            token.status = 'Used';
            token.scannedAt = new Date();
            token.scannedBy = new mongoose_2.Types.ObjectId(diningBoyId);
            await token.save();
            return { success: true, message: 'Token Verified! Serve Food ✅', meal: token.mealType };
        }
        throw new common_1.BadRequestException('Token validation failed for unknown reason.');
    }
    async getMyTokenStatus(userId) {
        const today = new Date();
        const currentHour = today.getHours();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        await this.diningTokenModel.updateMany({
            ownerId: new mongoose_2.Types.ObjectId(userId),
            status: 'Active',
            date: { $lt: startOfDay }
        }, {
            $set: { status: 'Expired' }
        });
        let activeTokens = await this.diningTokenModel.find({
            ownerId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        for (let token of activeTokens) {
            if (token.status === 'Active') {
                let shouldExpire = false;
                if (token.mealType === 'Lunch' && currentHour >= 14) {
                    shouldExpire = true;
                }
                else if (token.mealType === 'Dinner' && currentHour >= 22) {
                    shouldExpire = true;
                }
                if (shouldExpire) {
                    token.status = 'Expired';
                    await token.save();
                    console.log(`Token ${token.tokenID} expired due to time limit.`);
                }
            }
        }
        const finalTokens = await this.diningTokenModel.find({
            ownerId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        return {
            tokens: finalTokens
        };
    }
    async getUpcomingTokens(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tokens = await this.diningTokenModel.find({
            ownerId: new mongoose_2.Types.ObjectId(userId),
            status: 'Active',
            date: { $gte: today }
        })
            .sort({ date: 1 })
            .limit(32)
            .select('tokenID mealType date status')
            .exec();
        return tokens;
    }
    async getTokenHistory(userId) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const currentHour = new Date().getHours();
        const conditions = [
            { date: { $lt: todayStart } },
            { status: { $ne: 'Active' } }
        ];
        if (currentHour >= 15) {
            conditions.push({
                ownerId: new mongoose_2.Types.ObjectId(userId),
                date: { $gte: todayStart, $lte: todayEnd },
                mealType: 'Lunch'
            });
        }
        if (currentHour >= 23) {
            conditions.push({
                ownerId: new mongoose_2.Types.ObjectId(userId),
                date: { $gte: todayStart, $lte: todayEnd },
                mealType: 'Dinner'
            });
        }
        return this.diningTokenModel.find({
            ownerId: new mongoose_2.Types.ObjectId(userId),
            $or: conditions
        })
            .sort({ date: -1 })
            .limit(50)
            .exec();
    }
    async getDiningBoyScanHistory(userId) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const history = await this.diningTokenModel.find({
            scannedBy: new mongoose_2.Types.ObjectId(userId),
            scannedAt: { $gte: todayStart, $lte: todayEnd }
        })
            .sort({ scannedAt: -1 })
            .limit(50)
            .exec();
        const count = await this.diningTokenModel.countDocuments({
            scannedBy: new mongoose_2.Types.ObjectId(userId),
            scannedAt: { $gte: todayStart, $lte: todayEnd }
        });
        return { history, count };
    }
};
exports.DiningTokenService = DiningTokenService;
exports.DiningTokenService = DiningTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dining_token_schema_1.DiningToken.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DiningTokenService);
//# sourceMappingURL=dining-token.service.js.map