import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: any) {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async findOne(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string) {
    return this.userModel.findById(userId).select('-password').exec();
  }

  async updateProfile(userId: string, data: any) {
    return this.userModel.findByIdAndUpdate(userId, data, { new: true });
  }

  async verifyUser(userId: string, status: 'verified' | 'rejected') {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { status: status },
      { new: true }
    );
    return { message: `User is now ${status}`, user };
  }

  async findUsersByHallAndRole(hallName: string, role: string) {
    return this.userModel
      .find({ hallName: hallName, role: role }) 
      .select('-password') 
      .sort({ createdAt: -1 }) 
      .exec();
  }

  async changeUserRole(email: string, newRole: string, hallName: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    user.role = newRole;
    user.hallName = hallName; 
    return user.save();
  }
 

async removeDiningBoy(email: string) {
    console.log(`--- REMOVE REQUEST ---`);
    console.log(`Email received: "${email}"`);

    
    const existingUser = await this.userModel.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });

    if (!existingUser) {
        throw new Error("User not found with this email");
    }

    if (existingUser.role !== 'dining_boy') {
        throw new Error("This user is not a Dining Boy!");
    }

    await this.userModel.findByIdAndDelete(existingUser._id);
    
    return { message: "Dining boy removed successfully" };
}
}