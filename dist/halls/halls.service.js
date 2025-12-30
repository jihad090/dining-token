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
exports.HallsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const hall_schema_1 = require("./schemas/hall.schema");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../users/schemas/user.schema");
let HallsService = class HallsService {
    constructor(hallModel, userModel) {
        this.hallModel = hallModel;
        this.userModel = userModel;
    }
    async createHallWithAdmin(name, email, password, capacity) {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
            name: `${name}`,
            email: email,
            password: hashedPassword,
            role: 'hall_admin',
            hallName: `${name}`,
        });
        const savedUser = await newUser.save();
        const newHall = new this.hallModel({
            name: name,
            capacity: capacity,
            adminId: savedUser._id,
            notice: `Welcome to ${name}`,
        });
        await newHall.save();
        return {
            success: true,
            message: 'Hall and Admin created successfully!',
            hall: newHall,
            admin: {
                id: savedUser._id,
                email: savedUser.email,
                role: savedUser.role
            }
        };
    }
    async getAllHalls() {
        return this.hallModel.find().select('name capacity notice adminId').exec();
    }
    async getMyHall(userId) {
        const hall = await this.hallModel.findOne({ adminId: new mongoose_2.Types.ObjectId(userId) });
        if (!hall) {
            return null;
        }
        return hall;
    }
    async updateMyHallNotice(userId, notice) {
        const hall = await this.hallModel.findOneAndUpdate({ adminId: new mongoose_2.Types.ObjectId(userId) }, { $set: { notice } }, { new: true });
        if (!hall)
            throw new common_1.NotFoundException('Hall not found for this user');
        return hall;
    }
};
exports.HallsService = HallsService;
exports.HallsService = HallsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(hall_schema_1.Hall.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], HallsService);
//# sourceMappingURL=halls.service.js.map