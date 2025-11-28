import { Document, Types } from 'mongoose';
export type DiningTokenDocument = DiningToken & Document;
export declare class DiningToken {
    ownerId: Types.ObjectId;
    originalBuyerId: Types.ObjectId;
    tokenID: string;
    date: Date;
    mealType: string;
    status: string;
    resalePrice: number;
    transferHistory: {
        fromUser: Types.ObjectId;
        toUser: Types.ObjectId;
        date: Date;
        price: number;
    }[];
    scannedAt: Date;
    scannedBy: Types.ObjectId;
}
export declare const DiningTokenSchema: import("mongoose").Schema<DiningToken, import("mongoose").Model<DiningToken, any, any, any, Document<unknown, any, DiningToken, any, {}> & DiningToken & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DiningToken, Document<unknown, {}, import("mongoose").FlatRecord<DiningToken>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<DiningToken> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
