import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum VerificationStatus {
  NEW = 'new',           
  PENDING = 'pending',   
  VERIFIED = 'verified', 
  REJECTED = 'rejected'  
}

@Schema({ timestamps: true }) 
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string; 

  @Prop()
  googleId: string; 

  @Prop()
  avatar: string; 

  @Prop()
  phoneNumber: string;

  @Prop({ required: false, default: null })
  student_id?: string;
  
 @Prop({ required: false, default: null })
hallName?: string;

  @Prop({ default: VerificationStatus.NEW })
  status: string;

  @Prop({ default: 'user' }) 
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);