import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId; 

  @Prop({ required: true })
  bkashNumber: string;

  @Prop({ required: true, unique: true })
  trxId: string;

  @Prop({ required: true, enum: ['15_days', '30_days', 'rest_month'] })
  packageType: string;

@Prop({ required: true })
  daysCount: number;

  @Prop({ required: true })
  amount: number;
  
  @Prop({ 
    required: true, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING',
    index: true 
  })
  status: string;

  @Prop()
  approvedBy?: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ status: 1, createdAt: -1 });