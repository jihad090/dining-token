import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hall, HallDocument } from './schemas/hall.schema';
import { CreateHallDto } from './dto/create-hall.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
@Injectable()
export class HallsService {
  constructor(
    @InjectModel(Hall.name) private hallModel: Model<HallDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}


  async createHallWithAdmin(name: string, email: string, password: string, capacity: number) {
    
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
        throw new ConflictException('User with this email already exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
        name: `${name}`, 
        email: email,
        password: hashedPassword,
        role: 'hall_admin', 
        hallName:`${name}`, 
    });

    const savedUser = await newUser.save();

    const newHall = new this.hallModel({
        name: name,
        capacity: capacity,
        adminId: savedUser._id, 
        notice: `Welcome to ${name}`,
    });

    await newHall.save();

    return {
        success: true,
        message: 'Hall and Admin created successfully!',
        hall: newHall,
        admin: {
            id: savedUser._id,
            email: savedUser.email,
            role: savedUser.role
        }
    };
  }


  
  async getAllHalls() {
    return this.hallModel.find().select('name capacity notice adminId').exec();
  }

  async getMyHall(userId: string) {
    const hall = await this.hallModel.findOne({ adminId: new Types.ObjectId(userId) });
    if (!hall) {
      
      return null;
    }
    return hall;
  }

  async updateMyHallNotice(userId: string, notice: string) {
    const hall = await this.hallModel.findOneAndUpdate(
      { adminId: new Types.ObjectId(userId) },
      { $set: { notice } },
      { new: true }
    );
    if (!hall) throw new NotFoundException('Hall not found for this user');
    return hall;
  }
}