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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const auth_guard_1 = require("../auth/auth.guard");
const bcrypt = require("bcrypt");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async submitProfile(req, body) {
        const userId = req.user.sub;
        return this.usersService.updateProfile(userId, {
            phoneNumber: body.phoneNumber,
            nidNumber: body.nidNumber,
            status: 'pending'
        });
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.sub);
    }
    async findStudent(req, email) {
        if (req.user.role !== 'hall_admin') {
            throw new common_1.UnauthorizedException();
        }
        const user = await this.usersService.findStudentInHall(email, req.user.hallName);
        if (!user) {
            throw new common_1.NotFoundException('Student not found in your hall');
        }
        return user;
    }
    async promoteStudent(req, body) {
        if (req.user.role !== 'hall_admin')
            throw new common_1.UnauthorizedException();
        return this.usersService.changeUserRole(body.email, 'manager', req.user.hallName);
    }
    async demoteManager(req, body) {
        if (req.user.role !== 'hall_admin')
            throw new common_1.UnauthorizedException();
        return this.usersService.changeUserRole(body.email, 'user', req.user.hallName);
    }
    async getMyManagers(req) {
        const admin = await this.usersService.findById(req.user.sub);
        if (!admin || !admin.hallName) {
            throw new common_1.NotFoundException("Hall information not found for this admin");
        }
        return this.usersService.findUsersByHallAndRole(admin.hallName, 'manager');
    }
    async addDiningBoy(req, body) {
        if (req.user.role !== 'manager') {
            throw new common_1.UnauthorizedException('Only Managers can add dining boys');
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        return this.usersService.create({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: 'dining_boy',
            hallName: req.user.hallName,
            status: 'verified'
        });
    }
    async getMyDiningBoys(req) {
        return this.usersService.findUsersByHallAndRole(req.user.hallName, 'dining_boy');
    }
    async removeDiningBoy(req, body) {
        if (req.user.role !== 'manager') {
            throw new common_1.UnauthorizedException('Only managers can remove staff');
        }
        return this.usersService.removeDiningBoy(body.email);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('submit-profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "submitProfile", null);
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('find-student'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findStudent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('promote-student'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "promoteStudent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('demote-manager'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "demoteManager", null);
__decorate([
    (0, common_1.Get)('my-managers'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMyManagers", null);
__decorate([
    (0, common_1.Post)('add-dining-boy'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addDiningBoy", null);
__decorate([
    (0, common_1.Get)('my-dining-boys'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMyDiningBoys", null);
__decorate([
    (0, common_1.Post)('remove-dining-boy'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeDiningBoy", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map