

import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DiningTokenService } from '../dining-token/dining-token.service'; 
// Import Gateway
import { TransactionsGateway } from './transactions.gateway';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private trxModel: Model<TransactionDocument>,
    private readonly diningTokenService: DiningTokenService, 
    // Inject Gateway
    private readonly transactionsGateway: TransactionsGateway 
  ) {}

  
  async createOrder(userId: string, createTrxDto: CreateTransactionDto) {
    const existingTrx = await this.trxModel.findOne({ trxId: createTrxDto.trxId });
    if (existingTrx) {
        throw new ConflictException('This Transaction ID is already used!');
    }

    const newTrx = new this.trxModel({
        userId: new Types.ObjectId(userId),
        ...createTrxDto, 
        status: 'PENDING'
    });

    const savedTrx = await newTrx.save();

    // Notify Managers via WebSocket
    // Populate user info so manager sees the name instantly
    const populatedTrx = await savedTrx.populate('userId', 'name email id');
    this.transactionsGateway.notifyManagersNewRequest(populatedTrx);

    return savedTrx;
  }


  //manager get pending requests based on hall
  async getPendingTransactions(hallName: string) {
      const allPending = await this.trxModel.find({ status: 'PENDING' })
        .populate('userId', 'name email hallName') 
        .sort({ createdAt: -1 }) 
        .exec();

      return allPending.filter((trx: any) => 
          trx.userId && trx.userId.hallName === hallName
      );
  }

  async approveTransaction(trxId: string, managerId: string) {
    const transaction = await this.trxModel.findOneAndUpdate(
      { _id: trxId, status: 'PENDING' }, 
      { 
        $set: { 
          status: 'APPROVED', 
          approvedBy: new Types.ObjectId(managerId),
          updatedAt: new Date()
        } 
      },
      { new: true }
    ).populate('userId');

    if (!transaction) {
       // Just to be sure, check if it exists
       const exists = await this.trxModel.findById(trxId);
       if (!exists) throw new NotFoundException('Transaction not found');
       
       throw new ConflictException('Transaction already processed by another manager!');
    }
    const user = transaction.userId as any;

    // Issue Tokens
    await this.diningTokenService.issueTokens(
        transaction.userId._id.toString(), 
        transaction.daysCount,
        transaction._id.toString(),
        user.hallName
    );

    // Notify User via WebSocket
    this.transactionsGateway.notifyUserStatusUpdate(transaction.userId._id.toString(), {
        status: 'Approved',
        message: 'Your meal plan request has been Approved!',
        trxId: transaction.trxId
    });

    return transaction;
  }

  async rejectTransaction(trxId: string, managerId: string) {
    const transaction = await this.trxModel.findOneAndUpdate(
      { _id: trxId, status: 'PENDING' },
      { 
        $set: { 
          status: 'REJECTED', 
          approvedBy: new Types.ObjectId(managerId),
          updatedAt: new Date()
        } 
      },
      { new: true }
    ).populate('userId');

    if (!transaction) {
       const exists = await this.trxModel.findById(trxId);
       if (!exists) throw new NotFoundException('Transaction not found');
       throw new ConflictException('Transaction already processed by another manager!');
    }

    // Notify User via WebSocket
    this.transactionsGateway.notifyUserStatusUpdate(transaction.userId._id.toString(), {
        status: 'Rejected',
        message: 'Your request was Rejected.',
        trxId: transaction.trxId
    });

    return transaction;
  }


  async getTransactionHistory(hallName: string) {
      const allTransactions = await this.trxModel.find({ status: { $ne: 'PENDING' } })
        .populate('userId', 'name email hallName') 
        .sort({ updatedAt: -1 })
        .exec();

      return allTransactions.filter((trx: any) => 
          trx.userId && trx.userId.hallName === hallName
      );
  }
//user transaction history for diner home page
  async getUserTransactions(userId: string) {
      return this.trxModel.find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 }) 
        .exec();
  }
}
