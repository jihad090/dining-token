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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(data) {
        const newUser = new this.userModel(data);
        return newUser.save();
    }
    async findOne(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(userId) {
        return this.userModel.findById(userId).select('-password').exec();
    }
    async updateProfile(userId, data) {
        return this.userModel.findByIdAndUpdate(userId, data, { new: true });
    }
    async verifyUser(userId, status) {
        const user = await this.userModel.findByIdAndUpdate(userId, { status: status }, { new: true });
        return { message: `User is now ${status}`, user };
    }
    async findUsersByHallAndRole(hallName, role) {
        return this.userModel
            .find({ hallName: hallName, role: role })
            .select('-password')
            .sort({ createdAt: -1 })
            .exec();
    }
    async changeUserRole(email, newRole, hallName) {
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new Error("User not found");
        user.role = newRole;
        user.hallName = hallName;
        return user.save();
    }
    async removeDiningBoy(email) {
        console.log(`--- REMOVE REQUEST ---`);
        console.log(`Email received: "${email}"`);
        const existingUser = await this.userModel.findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });
        if (!existingUser) {
            throw new Error("User not found with this email");
        }
        if (existingUser.role !== 'dining_boy') {
            throw new Error("This user is not a Dining Boy!");
        }
        await this.userModel.findByIdAndDelete(existingUser._id);
        return { message: "Dining boy removed successfully" };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map