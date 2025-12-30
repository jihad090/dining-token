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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const auth_dto_1 = require("./dto/auth.dto");
let AuthController = class AuthController {
    constructor(authService, usersService, configService) {
        this.authService = authService;
        this.usersService = usersService;
        this.configService = configService;
    }
    register(body) {
        return this.authService.register(body);
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.sub);
    }
    login(body) {
        return this.authService.signIn(body.email, body.password);
    }
    async googleAuth(req) {
    }
    async googleAuthRedirect(req, res) {
        const { access_token } = req.user;
        const frontendUrl = this.configService.get('FRONTEND_REDIRECT_HOST');
        return res.redirect(`${frontendUrl}google-auth-callback?token=${access_token}`);
    }
    async seedAdmin() {
        const existingAdmin = await this.usersService.findOne('provost@cuet.ac.bd');
        if (existingAdmin) {
            return { message: 'Admin already exists!' };
        }
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const newAdmin = await this.usersService.create({
            name: "Provost Sir",
            email: "provost@cuet.ac.bd",
            password: hashedPassword,
            role: "hall_admin",
            hallName: "Muktijoddha Hall",
            status: "verified"
        });
        return { message: 'Admin Created Successfully!', admin: newAdmin };
    }
    async googleAuthSuccess(req) {
        const token = req.query.token;
        return {
            message: 'Google Login Successful! Use the token below to test APIs.',
            access_token: token
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('seed-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "seedAdmin", null);
__decorate([
    (0, common_1.Get)('success'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthSuccess", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map