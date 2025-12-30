import { Document, Types } from 'mongoose';
export type TransactionDocument = Transaction & Document;
export declare class Transaction {
    userId: Types.ObjectId;
    bkashNumber: string;
    trxId: string;
    packageType: string;
    daysCount: number;
    amount: number;
    status: string;
    approvedBy?: Types.ObjectId;
}
export declare const TransactionSchema: import("mongoose").Schema<Transaction, import("mongoose").Model<Transaction, any, any, any, Document<unknown, any, Transaction, any, {}> & Transaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, Document<unknown, {}, import("mongoose").FlatRecord<Transaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Transaction> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
