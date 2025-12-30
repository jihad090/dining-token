import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    createOrder(req: any, body: CreateTransactionDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").TransactionDocument, {}, {}> & import("./schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyHistory(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").TransactionDocument, {}, {}> & import("./schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    approveOrder(req: any, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").TransactionDocument, {}, {}> & import("./schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    rejectOrder(req: any, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").TransactionDocument, {}, {}> & import("./schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getHistory(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").TransactionDocument, {}, {}> & import("./schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPending(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").TransactionDocument, {}, {}> & import("./schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
