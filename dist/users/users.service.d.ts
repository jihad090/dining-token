import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { DiningTokenService } from '../dining-token/dining-token.service';
export declare class UsersService {
    private userModel;
    private diningTokenService;
    constructor(userModel: Model<User>, diningTokenService: DiningTokenService);
    create(data: any): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findOne(email: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findById(userId: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateProfile(userId: string, data: any): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    verifyUser(userId: string, status: 'verified' | 'rejected'): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    findUsersByHallAndRole(hallName: string, role: string): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findStudentInHall(email: string, hallName: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    changeUserRole(email: string, newRole: string, adminHallName: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    removeDiningBoy(email: string): Promise<{
        message: string;
    }>;
}
