import { Document, Types } from 'mongoose';
export type HallDocument = Hall & Document;
export declare class Hall {
    name: string;
    capacity: number;
    notice: string;
    adminId: Types.ObjectId;
}
export declare const HallSchema: import("mongoose").Schema<Hall, import("mongoose").Model<Hall, any, any, any, Document<unknown, any, Hall, any, {}> & Hall & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Hall, Document<unknown, {}, import("mongoose").FlatRecord<Hall>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Hall> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
