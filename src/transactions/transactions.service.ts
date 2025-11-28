import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DiningTokenService } from '../dining-token/dining-token.service'; 

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private trxModel: Model<TransactionDocument>,
    private readonly diningTokenService: DiningTokenService, 
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

    return await newTrx.save();
  }

  async getPendingTransactions() {
      return this.trxModel.find({ status: 'PENDING' })
        .populate('userId', 'name email id') 
        .sort({ createdAt: -1 }) 
        .exec();
  }

  async approveTransaction(trxId: string, managerId: string) {
    const transaction = await this.trxModel.findById(trxId);
    
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status === 'APPROVED') throw new BadRequestException('Already Approved');


    await this.diningTokenService.issueTokens(
        transaction.userId.toString(), 
        transaction.daysCount,
        transaction._id.toString()
    );

    transaction.status = 'APPROVED';
    transaction.approvedBy = new Types.ObjectId(managerId);
    
    return await transaction.save();
  }
  async rejectTransaction(trxId: string, managerId: string) {
    const transaction = await this.trxModel.findById(trxId);
    
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status !== 'PENDING') {
        throw new BadRequestException('Transaction is already processed (Approved/Rejected)');
    }

    transaction.status = 'REJECTED';
    transaction.approvedBy = new Types.ObjectId(managerId); 
    
    return await transaction.save();
  }
  async getTransactionHistory() {
      return this.trxModel.find({ status: { $ne: 'PENDING' } }) 
        .populate('userId', 'name email id') 
        .sort({ updatedAt: -1 }) 
        .limit(20) 
        .exec();
  }
}