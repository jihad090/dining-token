import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare enum VerificationStatus {
    NEW = "new",
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected"
}
export declare class User {
    name: string;
    email: string;
    password: string;
    googleId: string;
    avatar: string;
    phoneNumber: string;
    student_id?: string;
    hallName?: string;
    status: string;
    role: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
