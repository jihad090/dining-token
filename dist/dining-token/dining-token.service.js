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
    async scanToken(tokenID, scannerId, scannerRole, scannerHall) {
        const token = await this.diningTokenModel.findOne({ tokenID: tokenID })
            .populate('ownerId', 'hallName name email')
            .exec();
        if (!token) {
            throw new common_1.NotFoundException('Invalid Token ID');
        }
        const tokenOwner = token.ownerId;
        const tokenHallName = tokenOwner === null || tokenOwner === void 0 ? void 0 : tokenOwner.hallName;
        if (!tokenHallName || tokenHallName.trim() !== scannerHall.trim()) {
            throw new common_1.ForbiddenException(`🚫 RESTRICTED: This token is for ${tokenHallName || 'Unknown Hall'}. It cannot be scanned in ${scannerHall}.`);
        }
        if (token.status === 'Used') {
            throw new common_1.ConflictException('⚠️ Token already USED!');
        }
        if (token.status === 'Expired') {
            throw new common_1.BadRequestException('❌ Token EXPIRED!');
        }
        const today = new Date();
        const tokenDate = new Date(token.date);
        const todayStr = today.toDateString();
        const tokenDateStr = tokenDate.toDateString();
        if (todayStr !== tokenDateStr) {
            throw new common_1.BadRequestException(`❌ Invalid Date! This token is for ${tokenDateStr}, today is ${todayStr}.`);
        }
        token.status = 'Used';
        token.scannedBy = new mongoose_2.Types.ObjectId(scannerId);
        token.scannedAt = new Date();
        await token.save();
        return {
            success: true,
            message: 'Token Verified! Serve Food ✅',
            meal: token.mealType,
            studentName: tokenOwner === null || tokenOwner === void 0 ? void 0 : tokenOwner.name
        };
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
    async grantManagerFreeAccess(userId) {
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((lastDayOfMonth.getTime() - today.getTime()) / oneDay));
        const daysToIssue = diffDays > 0 ? diffDays : 1;
        return this.issueTokens(userId, daysToIssue, 'FREE_MANAGER_PERK');
    }
    async revokeManagerAccess(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        console.log(`Revoking access for: ${userId}, Deleting tokens from: ${tomorrow}`);
        const result = await this.diningTokenModel.deleteMany({
            ownerId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: tomorrow }
        }).exec();
        console.log(`Deleted ${result.deletedCount} tokens for demoted manager: ${userId}`);
        return result;
    }
    async handleEmergencyExtension(startDateStr, endDateStr, reason, adminId) {
        const closureStartDate = new Date(startDateStr);
        const closureEndDate = new Date(endDateStr);
        const diffInMilliseconds = closureEndDate.getTime() - closureStartDate.getTime();
        const daysToShift = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;
        if (daysToShift <= 0) {
            throw new common_1.BadRequestException('Invalid date range for closure extension.');
        }
        const hallReopenDate = new Date(closureEndDate);
        hallReopenDate.setDate(closureEndDate.getDate() + 1);
        hallReopenDate.setHours(0, 0, 0, 0);
        const affectedTokens = await this.diningTokenModel.find({
            status: { $in: ['Active', 'Expired'] },
            date: {
                $gte: closureStartDate,
                $lte: closureEndDate,
            },
        })
            .sort({ ownerId: 1, date: 1, mealType: 1 })
            .exec();
        if (affectedTokens.length === 0) {
            return {
                success: true,
                message: 'No unused tokens found within the closure period to extend.',
                shiftedCount: 0,
                closureDays: daysToShift,
            };
        }
        const tokensByUser = affectedTokens.reduce((acc, token) => {
            const ownerId = token.ownerId.toString();
            if (!acc[ownerId]) {
                acc[ownerId] = [];
            }
            acc[ownerId].push(token);
            return acc;
        }, {});
        let totalShiftedCount = 0;
        for (const ownerId of Object.keys(tokensByUser)) {
            const tokensToShift = tokensByUser[ownerId];
            const latestExistingToken = await this.diningTokenModel.findOne({
                ownerId: new mongoose_2.Types.ObjectId(ownerId),
                status: 'Active',
            })
                .sort({ date: -1 })
                .exec();
            let currentShiftDate = new Date(hallReopenDate);
            if (latestExistingToken) {
                currentShiftDate = new Date(latestExistingToken.date);
                currentShiftDate.setDate(currentShiftDate.getDate() + 1);
            }
            currentShiftDate.setHours(0, 0, 0, 0);
            const mealsPerDay = 2;
            for (let i = 0; i < tokensToShift.length; i++) {
                const token = tokensToShift[i];
                const daysToAdd = Math.floor(i / mealsPerDay);
                let finalNewDate = new Date(currentShiftDate);
                finalNewDate.setDate(currentShiftDate.getDate() + daysToAdd);
                finalNewDate.setHours(0, 0, 0, 0);
                await this.diningTokenModel.updateOne({ _id: token._id }, {
                    $set: {
                        date: finalNewDate,
                        status: 'Active',
                        extendedReason: reason,
                        extendedBy: new mongoose_2.Types.ObjectId(adminId),
                        extendedOn: new Date(),
                    }
                }).exec();
                totalShiftedCount++;
            }
        }
        return {
            success: true,
            message: `${totalShiftedCount} unused tokens have been dynamically re-activated and shifted.`,
            shiftedCount: totalShiftedCount,
            closureDays: daysToShift,
        };
    }
};
exports.DiningTokenService = DiningTokenService;
exports.DiningTokenService = DiningTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dining_token_schema_1.DiningToken.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DiningTokenService);
//# sourceMappingURL=dining-token.service.js.map