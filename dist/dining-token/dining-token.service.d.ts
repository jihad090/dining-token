import { Model, Types } from 'mongoose';
import { DiningToken, DiningTokenDocument } from './schemas/dining-token.schema';
export declare class DiningTokenService {
    private diningTokenModel;
    constructor(diningTokenModel: Model<DiningTokenDocument>);
    issueTokens(userId: string, days: number, transactionId: string): Promise<{
        message: string;
    }>;
    scanToken(tokenID: string, scannerId: string, scannerRole: string, scannerHall: string): Promise<{
        success: boolean;
        message: string;
        meal: string;
        studentName: any;
    }>;
    getMyTokenStatus(userId: string): Promise<{
        tokens: (import("mongoose").Document<unknown, {}, DiningTokenDocument, {}, {}> & DiningToken & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getUpcomingTokens(userId: string): Promise<(import("mongoose").Document<unknown, {}, DiningTokenDocument, {}, {}> & DiningToken & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTokenHistory(userId: string): Promise<(import("mongoose").Document<unknown, {}, DiningTokenDocument, {}, {}> & DiningToken & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getDiningBoyScanHistory(userId: string): Promise<{
        history: (import("mongoose").Document<unknown, {}, DiningTokenDocument, {}, {}> & DiningToken & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        count: number;
    }>;
    grantManagerFreeAccess(userId: string): Promise<{
        message: string;
    }>;
    revokeManagerAccess(userId: string): Promise<import("mongodb").DeleteResult>;
    handleEmergencyExtension(startDateStr: string, endDateStr: string, reason: string, adminId: string): Promise<{
        success: boolean;
        message: string;
        shiftedCount: number;
        closureDays: number;
    }>;
}
