import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HallDocument = Hall & Document;

@Schema({ timestamps: true })
export class Hall {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: '' })
  notice: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  adminId: Types.ObjectId;
}

export const HallSchema = SchemaFactory.createForClass(Hall);