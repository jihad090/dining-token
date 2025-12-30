import { DiningTokenService } from './dining-token.service';
export declare class DiningTokenController {
    private readonly diningTokenService;
    constructor(diningTokenService: DiningTokenService);
    scanToken(req: any, body: {
        tokenID: string;
    }): Promise<{
        success: boolean;
        message: string;
        meal: string;
        studentName: any;
    }>;
    getMyStatus(req: any): Promise<{
        tokens: (import("mongoose").Document<unknown, {}, import("./schemas/dining-token.schema").DiningTokenDocument, {}, {}> & import("./schemas/dining-token.schema").DiningToken & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getUpcoming(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/dining-token.schema").DiningTokenDocument, {}, {}> & import("./schemas/dining-token.schema").DiningToken & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getHistory(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/dining-token.schema").DiningTokenDocument, {}, {}> & import("./schemas/dining-token.schema").DiningToken & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getDiningBoyHistory(req: any): Promise<{
        history: (import("mongoose").Document<unknown, {}, import("./schemas/dining-token.schema").DiningTokenDocument, {}, {}> & import("./schemas/dining-token.schema").DiningToken & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        count: number;
    }>;
    extendClosure(req: any, body: {
        startDate: string;
        endDate: string;
        reason: string;
    }): Promise<{
        success: boolean;
        message: string;
        shiftedCount: number;
        closureDays: number;
    }>;
}
