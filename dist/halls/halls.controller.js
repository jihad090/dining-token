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
exports.HallsController = void 0;
const common_1 = require("@nestjs/common");
const halls_service_1 = require("./halls.service");
const auth_guard_1 = require("../auth/auth.guard");
let HallsController = class HallsController {
    constructor(hallsService) {
        this.hallsService = hallsService;
    }
    async getAllHalls() {
        return this.hallsService.getAllHalls();
    }
    async createHallAndAdmin(req, body) {
        return this.hallsService.createHallWithAdmin(body.name, body.email, body.password, body.capacity);
    }
    async getMyHall(req) {
        return this.hallsService.getMyHall(req.user.sub);
    }
    async updateHallInfo(req, body) {
        return this.hallsService.updateMyHallNotice(req.user.sub, body.notice);
    }
};
exports.HallsController = HallsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "getAllHalls", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "createHallAndAdmin", null);
__decorate([
    (0, common_1.Get)('my-hall'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "getMyHall", null);
__decorate([
    (0, common_1.Patch)('my-hall'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "updateHallInfo", null);
exports.HallsController = HallsController = __decorate([
    (0, common_1.Controller)('halls'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [halls_service_1.HallsService])
], HallsController);
//# sourceMappingURL=halls.controller.js.map