import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DiningTokenDocument = DiningToken & Document;

@Schema({ timestamps: true })
export class DiningToken {
  
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  originalBuyerId: Types.ObjectId;

  
  @Prop({ required: true, unique: true, index: true })
  tokenID: string; 

  @Prop({ required: true, index: true })
  date: Date; 

  @Prop({ required: true, enum: ['Lunch', 'Dinner'] })
  mealType: string;


  @Prop({ 
    required: true, 
    enum: ['Active', 'Used', 'Expired', 'Listed_For_Sale', 'Sold'], 
    default: 'Active',
    index: true 
  })
  status: string;

  @Prop({ default: null })
  resalePrice: number;

  
  @Prop({ 
    type: [{
      fromUser: { type: Types.ObjectId, ref: 'User' },
      toUser: { type: Types.ObjectId, ref: 'User' },
      date: Date,
      price: Number
    }], 
    default: [] 
  })
  transferHistory: {
    fromUser: Types.ObjectId;
    toUser: Types.ObjectId;
    date: Date;
    price: number;
  }[];
  @Prop({ type: Date })
  scannedAt: Date; 

  @Prop({ type: Types.ObjectId, ref: 'User' })
  scannedBy: Types.ObjectId;
}

export const DiningTokenSchema = SchemaFactory.createForClass(DiningToken);

DiningTokenSchema.index({ ownerId: 1, date: 1, mealType: 1 }, { unique: true });