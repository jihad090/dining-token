import { ConflictException,NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { DiningTokenService } from '../dining-token/dining-token.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private diningTokenService: DiningTokenService
  ) {}

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


  //payment verify for token issuance
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

  
  async findStudentInHall(email: string, hallName: string) {
    const user = await this.userModel.findOne({ 
        email: email,
        hallName: hallName 
    }).select('-password'); 

    return user;
}




async changeUserRole(email: string, newRole: string, adminHallName: string) {
    const user = await this.userModel.findOne({ 
        email: email, 
        hallName: adminHallName 
    });

    if (!user) {
        throw new NotFoundException("Student not found within your hall.");
    }

    if (user.role === newRole) {
        throw new ConflictException(`User is already a ${newRole}.`); 
    }
    if (user.role === 'manager' && newRole !== 'manager') {
        await this.diningTokenService.revokeManagerAccess(user._id.toString());
        console.log(`Manager privileges revoked for: ${email}`);
    }

    user.role = newRole;
    
    const savedUser = await user.save();

    if (newRole === 'manager') {
        await this.diningTokenService.grantManagerFreeAccess(savedUser._id.toString() , adminHallName);
    }

    return savedUser;
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