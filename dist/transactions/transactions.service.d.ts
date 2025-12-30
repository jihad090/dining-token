import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DiningTokenService } from '../dining-token/dining-token.service';
import { TransactionsGateway } from './transactions.gateway';
export declare class TransactionsService {
    private trxModel;
    private readonly diningTokenService;
    private readonly transactionsGateway;
    constructor(trxModel: Model<TransactionDocument>, diningTokenService: DiningTokenService, transactionsGateway: TransactionsGateway);
    createOrder(userId: string, createTrxDto: CreateTransactionDto): Promise<import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPendingTransactions(hallName: string): Promise<(import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    approveTransaction(trxId: string, managerId: string): Promise<import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    rejectTransaction(trxId: string, managerId: string): Promise<import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTransactionHistory(hallName: string): Promise<(import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUserTransactions(userId: string): Promise<(import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
