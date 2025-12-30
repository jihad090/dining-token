import { Model, Types } from 'mongoose';
import { Hall, HallDocument } from './schemas/hall.schema';
import { UserDocument } from '../users/schemas/user.schema';
export declare class HallsService {
    private hallModel;
    private userModel;
    constructor(hallModel: Model<HallDocument>, userModel: Model<UserDocument>);
    createHallWithAdmin(name: string, email: string, password: string, capacity: number): Promise<{
        success: boolean;
        message: string;
        hall: import("mongoose").Document<unknown, {}, HallDocument, {}, {}> & Hall & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        admin: {
            id: Types.ObjectId;
            email: string;
            role: string;
        };
    }>;
    getAllHalls(): Promise<(import("mongoose").Document<unknown, {}, HallDocument, {}, {}> & Hall & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getMyHall(userId: string): Promise<import("mongoose").Document<unknown, {}, HallDocument, {}, {}> & Hall & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateMyHallNotice(userId: string, notice: string): Promise<import("mongoose").Document<unknown, {}, HallDocument, {}, {}> & Hall & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
