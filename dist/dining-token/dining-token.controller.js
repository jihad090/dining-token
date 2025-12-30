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
exports.DiningTokenController = void 0;
const common_1 = require("@nestjs/common");
const dining_token_service_1 = require("./dining-token.service");
const auth_guard_1 = require("../auth/auth.guard");
let DiningTokenController = class DiningTokenController {
    constructor(diningTokenService) {
        this.diningTokenService = diningTokenService;
    }
    async scanToken(req, body) {
        const scannerHall = req.user.hallName || req.user.hallId;
        if (!scannerHall) {
            throw new common_1.UnauthorizedException('Scanner Hall ID not found in user session.');
        }
        return this.diningTokenService.scanToken(body.tokenID, req.user.sub, req.user.role, scannerHall);
    }
    async getMyStatus(req) {
        return this.diningTokenService.getMyTokenStatus(req.user.sub);
    }
    async getUpcoming(req) {
        return this.diningTokenService.getUpcomingTokens(req.user.sub);
    }
    async getHistory(req) {
        const userId = req.user.sub || req.user.id;
        if (!userId)
            throw new common_1.UnauthorizedException('Invalid user token');
        return this.diningTokenService.getTokenHistory(userId);
    }
    async getDiningBoyHistory(req) {
        if (req.user.role !== 'dining_boy' && req.user.role !== 'manager') {
            throw new common_1.UnauthorizedException('Only Dining Boys and Managers can view scan history');
        }
        return this.diningTokenService.getDiningBoyScanHistory(req.user.sub);
    }
    async extendClosure(req, body) {
        if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
            throw new common_1.UnauthorizedException('Access Denied: Only Manager or Hall Admin Allowed to extend tokens');
        }
        return this.diningTokenService.handleEmergencyExtension(body.startDate, body.endDate, body.reason, req.user.sub);
    }
};
exports.DiningTokenController = DiningTokenController;
__decorate([
    (0, common_1.Post)('scan'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiningTokenController.prototype, "scanToken", null);
__decorate([
    (0, common_1.Get)('my-status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiningTokenController.prototype, "getMyStatus", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiningTokenController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiningTokenController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('dining-boy/history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiningTokenController.prototype, "getDiningBoyHistory", null);
__decorate([
    (0, common_1.Post)('extend-closure'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiningTokenController.prototype, "extendClosure", null);
exports.DiningTokenController = DiningTokenController = __decorate([
    (0, common_1.Controller)('dining-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [dining_token_service_1.DiningTokenService])
], DiningTokenController);
//# sourceMappingURL=dining-token.controller.js.map