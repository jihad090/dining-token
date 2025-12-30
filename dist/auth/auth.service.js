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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(userDto) {
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        try {
            return await this.usersService.create(Object.assign(Object.assign({}, userDto), { password: hashedPassword, status: 'new', tokens: 0 }));
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('email already exists.Please use a different email');
            }
            throw error;
        }
    }
    async signIn(email, pass) {
        const user = await this.usersService.findOne(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.password) {
            const isMatch = await bcrypt.compare(pass, user.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
        }
        else {
            throw new common_1.UnauthorizedException('Please login with Google');
        }
        return this.generateToken(user);
    }
    async googleLogin(googleUser) {
        let user = await this.usersService.findOne(googleUser.email);
        if (!user) {
            user = await this.usersService.create({
                email: googleUser.email,
                name: googleUser.firstName + ' ' + googleUser.lastName,
                googleId: googleUser.id,
                avatar: googleUser.picture,
                status: 'new',
                tokens: 0,
                hallName: null,
                role: 'user',
            });
        }
        return this.generateToken(user);
    }
    async generateToken(user) {
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
            status: user.status,
            hallName: user.hallName || null
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                status: user.status,
                role: user.role,
                hallName: user.hallName
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map