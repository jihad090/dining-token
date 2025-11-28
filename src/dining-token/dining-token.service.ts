import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DiningToken, DiningTokenDocument } from './schemas/dining-token.schema';

@Injectable()
export class DiningTokenService {
  constructor(
    @InjectModel(DiningToken.name) private diningTokenModel: Model<DiningTokenDocument>,
  ) {}

 
async issueTokens(userId: string, days: number, transactionId: string) {
    const tokensToInsert = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today); 
    startDate.setDate(today.getDate() + 1); 

    const shortUserId = userId.slice(-7).toUpperCase();

    for (let i = 0; i < days; i++) {
      
      const activeDate = new Date(startDate);
      activeDate.setDate(startDate.getDate() + i);

      
      const randL = Math.floor(100000 + Math.random() * 900000);
      tokensToInsert.push({
        ownerId: new Types.ObjectId(userId),
        originalBuyerId: new Types.ObjectId(userId),
        date: activeDate, 
        mealType: 'Lunch',
        tokenID: `${shortUserId}-L-${randL}`, 
        status: 'Active'
      });

      const randD = Math.floor(100000 + Math.random() * 900000);
      tokensToInsert.push({
        ownerId: new Types.ObjectId(userId),
        originalBuyerId: new Types.ObjectId(userId),
        date: activeDate, 
        mealType: 'Dinner',
        tokenID: `${shortUserId}-D-${randD}`,
        status: 'Active'
      });
    }

    if (tokensToInsert.length > 0) {
      await this.diningTokenModel.insertMany(tokensToInsert);
    }
    
    return { message: `${tokensToInsert.length} tokens generated successfully` };
  }



 async scanToken(tokenID: string, diningBoyId: string) {
    const token = await this.diningTokenModel.findOne({ tokenID });
    if (!token) throw new NotFoundException('Invalid Token! QR Code not match.');

    const now = new Date();
    const tokenDate = new Date(token.date);
    const today = new Date();
    today.setHours(0,0,0,0);
    tokenDate.setHours(0,0,0,0);

    
    if (token.status === 'Used') {
      throw new ConflictException('WARNING: Token ALREADY USED!');
    }
    if (token.status === 'Expired') {
      throw new BadRequestException('Token is EXPIRED!');
    }


    
    if (tokenDate < today) {
        throw new BadRequestException('Token Date is past! EXPIRED.');
    }
    
    if (tokenDate > today) {
        throw new BadRequestException(`Not Active Yet! Valid for ${tokenDate.toDateString()}.`);
    }

    const currentHour = now.getHours();
    let isValidTime = false;

    if (token.mealType === 'Lunch') {
        if (currentHour >= 13 && currentHour < 15) {
            isValidTime = true;
        } else {
            throw new BadRequestException('Lunch meal time (1PM - 3PM) is over or not started!');
        }
    } 
    else if (token.mealType === 'Dinner') {
        if (currentHour >= 21 && currentHour < 23) {
            isValidTime = true;
        } else {
            throw new BadRequestException('Dinner meal time (9PM - 11PM) is over or not started!');
        }
    }


    if (isValidTime) {
        token.status = 'Used';
        token.scannedAt = new Date();
        token.scannedBy = new Types.ObjectId(diningBoyId);
        await token.save();
    
        return { success: true, message: 'Token Verified! Serve Food ✅', meal: token.mealType };
    }

    throw new BadRequestException('Token validation failed for unknown reason.'); 
  }

  
  async getMyTokenStatus(userId: string) {
    const today = new Date();
    
    const currentHour = today.getHours(); 
    
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    await this.diningTokenModel.updateMany(
        {
            ownerId: new Types.ObjectId(userId),
            status: 'Active',
            date: { $lt: startOfDay } 
        },
        {
            $set: { status: 'Expired' }
        }
    );

    let activeTokens = await this.diningTokenModel.find({
      ownerId: new Types.ObjectId(userId),
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    for (let token of activeTokens) {
        if (token.status === 'Active') {
            let shouldExpire = false;

           
            if (token.mealType === 'Lunch' && currentHour >= 14) {
                shouldExpire = true;
            }
            
           
            else if (token.mealType === 'Dinner' && currentHour >= 22) {
                shouldExpire = true;
            }

            if (shouldExpire) {
                token.status = 'Expired';
                await token.save(); 
                console.log(`Token ${token.tokenID} expired due to time limit.`);
            }
        }
    }

    
    const finalTokens = await this.diningTokenModel.find({
        ownerId: new Types.ObjectId(userId),
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    return {
      tokens: finalTokens
    };
  }

  // Get upcoming tokens for pdf file
  async getUpcomingTokens(userId: string) {
    const today = new Date();
    today.setHours(0,0,0,0); 

    const tokens = await this.diningTokenModel.find({
      ownerId: new Types.ObjectId(userId),
      status: 'Active', 
      date: { $gte: today } 
    })
    .sort({ date: 1 }) 
    .limit(32) 
    .select('tokenID mealType date status') 
    .exec();

    return tokens;
  }

  //user token history
  async getTokenHistory(userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const currentHour = new Date().getHours();

    const conditions: any[] = [
        { date: { $lt: todayStart } }, 
        { status: { $ne: 'Active' } }  
    ];

    
    if (currentHour >= 15) {
        conditions.push({
            ownerId: new Types.ObjectId(userId),
            date: { $gte: todayStart, $lte: todayEnd },
            mealType: 'Lunch'
        });
    }

    if (currentHour >= 23) {
        conditions.push({
            ownerId: new Types.ObjectId(userId),
            date: { $gte: todayStart, $lte: todayEnd },
            mealType: 'Dinner'
        });
    }

    return this.diningTokenModel.find({ 
        ownerId: new Types.ObjectId(userId),
        $or: conditions
    })
    .sort({ date: -1 }) 
    .limit(50)
    .exec();
  }

  //history of dining boy scans
  async getDiningBoyScanHistory(userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Fetch recent scans
    const history = await this.diningTokenModel.find({
      scannedBy: new Types.ObjectId(userId), 
      scannedAt: { $gte: todayStart, $lte: todayEnd } 
    })
    .sort({ scannedAt: -1 }) 
    .limit(50)
    .exec();

    const count = await this.diningTokenModel.countDocuments({
      scannedBy: new Types.ObjectId(userId),
      scannedAt: { $gte: todayStart, $lte: todayEnd }
    });

    return { history, count };
  }
  
  
}