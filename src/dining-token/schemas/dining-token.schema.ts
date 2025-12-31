import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DiningTokenDocument = DiningToken & Document;
@Schema()
export class ChatMessage {
    @Prop() senderId: string;
    @Prop() senderName: string;
    @Prop() text: string;
    @Prop({ default: Date.now }) timestamp: Date;
}
const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

@Schema({ timestamps: true })
export class DiningToken {
  
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  originalBuyerId: Types.ObjectId;

  @Prop({ required: true, index: true })
  hallName: string;

  @Prop({ required: true, unique: true, index: true })
  tokenID: string; 

  @Prop({ required: true, index: true })
  date: Date; 

  @Prop({ required: true, enum: ['Lunch', 'Dinner'] })
  mealType: string;


  @Prop({ 
    required: true, 
    enum: ['Active', 'Used', 'Expired', 'Listed', 'Requested', 'Sold'], 
    default: 'Active',
    index: true 
  })
  status: string;

  @Prop({ default: 40 })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  requestedBy: Types.ObjectId;

  @Prop({
    type: [{
      sellerId: { type: Types.ObjectId, ref: 'User' },
      buyerId: { type: Types.ObjectId, ref: 'User' },
      soldPrice: Number,
      soldDate: Date,
      previousTokenID: String ,
      status: String
    }],
    default: []
  })
  transferHistory: {
      sellerId: Types.ObjectId;
      buyerId: Types.ObjectId;
      soldPrice: number;
      soldDate: Date;
      previousTokenID: string;
      status: string;
  }[];

  @Prop({ type: Date })
  scannedAt: Date; 

  @Prop({ type: Types.ObjectId, ref: 'User' })
  scannedBy: Types.ObjectId;

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages: ChatMessage[];

@Prop({
   enum: ['None', 'Pending', 'Paid'], 
    default: 'None',
  }) 
  paymentStatus: string;
}

export const DiningTokenSchema = SchemaFactory.createForClass(DiningToken);

DiningTokenSchema.index({ ownerId: 1, date: 1, mealType: 1 }, { unique: true });