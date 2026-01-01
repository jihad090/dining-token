import { Injectable, NotFoundException, BadRequestException, ConflictException,ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DiningToken, DiningTokenDocument } from './schemas/dining-token.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { TransactionsGateway } from '../transactions/transactions.gateway'; 

@Injectable()
export class DiningTokenService {
  constructor(
    @InjectModel(DiningToken.name) private diningTokenModel: Model<DiningTokenDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly transactionsGateway: TransactionsGateway
  ) {}

 private getBDCurrentHour(): number {
    const now = new Date();
    const bdTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    return bdTime.getHours(); 
}

private getBDBoundaries() {
    const now = new Date();
    const bdOffset = 6 * 60 * 60 * 1000; // ৬ ঘণ্টা
    const bdNow = new Date(now.getTime() + bdOffset);
    
    bdNow.setUTCHours(0, 0, 0, 0);
    const startOfBdDay = new Date(bdNow.getTime() - bdOffset);

    bdNow.setUTCHours(23, 59, 59, 999);
    const endOfBdDay = new Date(bdNow.getTime() - bdOffset);

    return { startOfBdDay, endOfBdDay };
}

async issueTokens(userId: string, days: number, transactionId: string, hallName: string) {
  
    
    const fixedHallName = hallName;
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
        hallName: fixedHallName,
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
        hallName: fixedHallName,
        tokenID: `${shortUserId}-D-${randD}`,
        status: 'Active'
      });
    }

    if (tokensToInsert.length > 0) {
      await this.diningTokenModel.insertMany(tokensToInsert);
    }
    
    return { message: `${tokensToInsert.length} tokens generated successfully` };
  }



  
async scanToken(tokenID: string, scannerId: string, scannerRole: string, scannerHall: string) {
    
    const token = await this.diningTokenModel.findOne({ tokenID: tokenID })
        .populate('ownerId', 'hallName name student_id email') 
        .exec();

    if (!token) {
        throw new NotFoundException('Invalid Token ID');
    }


const currentScannerHall = scannerHall.trim();
    const tokenHallName = token.hallName.trim();

    if (tokenHallName !== currentScannerHall) {
        throw new ForbiddenException(
            `🚫 RESTRICTED: This token is for ${tokenHallName || 'Unknown Hall'}. It cannot be scanned in ${scannerHall}.`
        );
    }

    if (token.status === 'Used') {
        throw new ConflictException('⚠️ Token already USED!');
    }

    if (token.status === 'Expired') {
        throw new BadRequestException('❌ Token EXPIRED!');
    }

    const today = new Date();
    const tokenDate = new Date(token.date);
    
    const todayStr = today.toDateString();
    const tokenDateStr = tokenDate.toDateString();

    if (todayStr !== tokenDateStr) {
        throw new BadRequestException(`❌ Invalid Date! This token is for ${tokenDateStr}, today is ${todayStr}.`);
    }

  
    token.status = 'Used';
    token.scannedBy = new Types.ObjectId(scannerId); 
    token.scannedAt = new Date();
    
    await token.save();

    return {
        success: true,
        message: 'Token Verified! Serve Food ✅',
        meal: token.mealType,
       // studentName: tokenOwner?.name
    };
  }
  

  // for listing token for sale
  async listToken(tokenId: string, userId: string, price: number) {
    const token = await this.diningTokenModel.findOne({ 
        tokenID: tokenId, 
        ownerId: new Types.ObjectId(userId) 
    });

    if (!token) throw new NotFoundException('Token not found or unauthorized');
    if (token.status !== 'Active') throw new BadRequestException('Only active tokens can be sold');

    token.status = 'Listed';
    token.price = price;
    return token.save();
  }

// market palce view

async getMarketplace(viewerId: string) {
const currentHour = this.getBDCurrentHour();
    const { startOfBdDay, endOfBdDay } = this.getBDBoundaries();    
    await this.diningTokenModel.updateMany(
        { status: 'Listed', date: { $lt: startOfBdDay  } },
        { $set: { status: 'Expired' } }
    );

    return this.diningTokenModel.find({
        date: { $gte: startOfBdDay },
        $or: [
            { 
                status: 'Listed', 
                ownerId: { $ne: new Types.ObjectId(viewerId) } 
            },
            { 
                status: 'Requested', 
                requestedBy: new Types.ObjectId(viewerId) 
            }
        ]
    })
    .populate('ownerId', 'name hallName paymentNumber email  student_id phoneNumber date') 
    .populate('requestedBy', '_id name email  student_id phoneNumber') 
    .sort({ date: 1 });
}

  //(My Sales Tab)
  async getMySellPosts(userId: string) {
    return this.diningTokenModel.find({
        ownerId: new Types.ObjectId(userId),
        status: { $in: ['Listed', 'Requested'] }
    })
    .populate('requestedBy', 'name email student_id phoneNumber') 
    .sort({ date: 1 });
  }

  //  (Sold History)
  async getMySoldHistory(sellerId: string) {
    const tokens = await this.diningTokenModel.find({
        'transferHistory.sellerId': new Types.ObjectId(sellerId)
    }).select('mealType date transferHistory').lean();

    const mySales = [];

    tokens.forEach(token => {
        const myTransactions = token.transferHistory.filter(
            h => h.sellerId.toString() === sellerId.toString()
        );

        myTransactions.forEach(trans => {
            mySales.push({
                _id: token._id, 
                mealType: token.mealType,
                date: token.date, 
                soldDate: trans.soldDate, 
                soldPrice: trans.soldPrice,
                status: trans.status 
            });
        });
    });

    return mySales.sort((a, b) => new Date(b.soldDate).getTime() - new Date(a.soldDate).getTime());
  }

  // buyer request (Lock Token)

  async requestToken(dbId: string, buyerId: string) {
    const token = await this.diningTokenModel.findById(dbId).populate('ownerId', 'name email student_id hallName'); 
    if (!token) throw new NotFoundException('Token unavailable');

    if (token.status !== 'Listed') {
        throw new BadRequestException('Token is not available for sale');
    }

    if (token.ownerId['_id'].toString() === buyerId) {
        throw new BadRequestException('You cannot buy your own token');
    }

    const existingToken = await this.diningTokenModel.findOne({
        ownerId: new Types.ObjectId(buyerId), 
        date: token.date,                    
        mealType: token.mealType,             
        status: { $in: ['Active', 'Listed', 'Requested'] } 
    });

    if (existingToken) {
        throw new ConflictException('You already have a token for this meal time!');
    }

    const buyer = await this.userModel.findById(buyerId);

    token.status = 'Requested';
    token.requestedBy = new Types.ObjectId(buyerId);
    await token.save();

    const ownerIdStr = token.ownerId['_id'].toString(); 
    
    this.transactionsGateway.notifySellerOfRequest(ownerIdStr, {
        title: 'New Buy Request!',
        message: `${buyer.name} requested to buy your ${token.mealType}.`,
        tokenId: token._id,
        buyerId: buyerId 
    });

    return { success: true, message: 'Request sent! Waiting for seller approval.' };
}

  //seller confirms sell

async confirmSell(tokenId: string, sellerId: string) {
    const token = await this.diningTokenModel.findById(tokenId);
    if (!token) throw new NotFoundException('Token not found');

    if (token.ownerId.toString() !== sellerId) {
        throw new UnauthorizedException('You are not the owner');
    }
    if (!token.requestedBy) {
        throw new BadRequestException('No buyer requested this token.');
    }

    const buyerId = token.requestedBy; 
    
    const oldTokenID = token.tokenID;  
    const soldPrice = token.price;   

    if (!token.transferHistory) {
        token.transferHistory = [];
    }

    token.transferHistory.push({
        sellerId: new Types.ObjectId(sellerId), 
        buyerId: buyerId,                       
        soldPrice: soldPrice,                   
        soldDate: new Date(),                   
        previousTokenID: oldTokenID,
        status: 'Sold'
    });

    
    token.ownerId = buyerId; 

    const shortBuyerId = buyerId.toString().slice(-7).toUpperCase();
    const mealCode = token.mealType === 'Lunch' ? 'L' : 'D';
    const randNum = Math.floor(100000 + Math.random() * 900000);
    
    token.tokenID = `${shortBuyerId}-${mealCode}-${randNum}`;

    token.status = 'Active'; 
    token.price = 0; 
    token.requestedBy = undefined;
    token.paymentStatus = 'None';
    token.messages = []; 

    await token.save();

    this.transactionsGateway.notifyTransferComplete(buyerId.toString(), {
        message: `Token Received! New ID: ${token.tokenID}`,
        tokenID: token._id
    });

    return { success: true, message: 'Token transferred and history recorded.' };
}



  async getMyTokenStatus(userId: string) {
    const today = new Date();
    
const currentHour = this.getBDCurrentHour();

    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    await this.diningTokenModel.updateMany(
        {
            ownerId: new Types.ObjectId(userId),
            status: { $in: ['Active', 'Listed', 'Requested'] },
            date: { $lt: startOfDay } 
        },
        {
            $set: {
                 status: 'Expired',
                price: 0,
                requestedBy: null
            }
        }
    );

    let activeTokens = await this.diningTokenModel.find({
      ownerId: new Types.ObjectId(userId),
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    for (let token of activeTokens) {
       if (['Active', 'Listed', 'Requested'].includes(token.status)) {
            let shouldExpire = false;

           
            if (token.mealType === 'Lunch' && currentHour >= 14) {
                shouldExpire = true;
            }
            
           
            else if (token.mealType === 'Dinner' && currentHour >= 23) {
                shouldExpire = true;
            }

            if (shouldExpire) {
                token.status = 'Expired';
                token.price = 0;
                token.requestedBy = null;
                token.paymentStatus = 'None';
                await token.save(); 
                console.log(`Token ${token.tokenID} expired due to time limit.`);
            }
        }
    }

    
    const finalTokens = await this.diningTokenModel.find({
        ownerId: new Types.ObjectId(userId),
          status: 'Active',
        date: { $gte: startOfDay, $lte: endOfDay }
    })
.populate('ownerId', 'name hallName');
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



//for manager free access tokens
async grantManagerFreeAccess(userId: string, hallName: string) {
    const today = new Date();
    
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((lastDayOfMonth.getTime() - today.getTime()) / oneDay));

    
    const daysToIssue = diffDays > 0 ? diffDays : 1;

    return this.issueTokens(userId, daysToIssue, 'FREE_MANAGER_PERK', hallName);
}

//token revoke for demoted manager
async revokeManagerAccess(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    console.log(`Revoking access for: ${userId}, Deleting tokens from: ${tomorrow}`);

    const result = await this.diningTokenModel.deleteMany({
        ownerId: new Types.ObjectId(userId),
        date: { $gte: tomorrow } 
    }).exec();

    console.log(`Deleted ${result.deletedCount} tokens for demoted manager: ${userId}`);
    return result;
}


// Chat functionality
  async sendChatMessage(tokenId: string, senderId: string, text: string) {
    const token = await this.diningTokenModel.findById(tokenId);
    if (!token) throw new NotFoundException('Token not found');

    const sender = await this.userModel.findById(senderId);
    const senderName = sender ? sender.name : 'User';

   
    const newMessage = {
        senderName,
        senderId,
        text,
        timestamp: new Date()
    };

    if (!token.messages) token.messages = [];
    token.messages.push(newMessage);
    
    await token.save();

    const receiverId = token.ownerId.toString() === senderId 
        ? token.requestedBy.toString() 
        : token.ownerId.toString();

    this.transactionsGateway.notifyChatMessage(receiverId, {
        tokenId: token._id,
        message: newMessage
    });

    return { success: true, message: 'Message sent', data: newMessage };
}

  async getChatMessages(tokenId: string) {
      const token = await this.diningTokenModel.findById(tokenId);
      return token ? token.messages : [];
  }


async markTokenAsPaid(tokenId: string, buyerId: string) {
    const token = await this.diningTokenModel.findById(tokenId);
    if (!token) throw new NotFoundException('Token not found');

    if (token.requestedBy?.toString() !== buyerId) {
        throw new UnauthorizedException('Only the buyer can mark this as paid.');
    }

    token.paymentStatus = 'Paid';
    await token.save();

    const sellerId = token.ownerId.toString();
    console.log(`DEBUG: Paying Token ${token._id}`);
    console.log(`DEBUG: Buyer (Me): ${buyerId}`);
    console.log(`DEBUG: Seller (Target): ${sellerId}`);
    this.transactionsGateway.notifyUserStatusUpdate(sellerId, {
        tokenID: token._id,
        status: 'Paid',
        message: 'Buyer has marked the payment as PAID. Please verify.'
    });

    return { success: true, message: 'Marked as Paid' };
}






  //Use only emergency situations
async handleEmergencyExtension(startDateStr: string, endDateStr: string, reason: string, adminId: string) {
    const closureStartDate = new Date(startDateStr);
    const closureEndDate = new Date(endDateStr);

    // counting days
    const diffInMilliseconds = closureEndDate.getTime() - closureStartDate.getTime();
    const daysToShift = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

    if (daysToShift <= 0) {
      throw new BadRequestException('Invalid date range for closure extension.');
    }

    const hallReopenDate = new Date(closureEndDate);
    hallReopenDate.setDate(closureEndDate.getDate() + 1);
    hallReopenDate.setHours(0, 0, 0, 0);


    const affectedTokens = await this.diningTokenModel.find({
      status: { $in: ['Active', 'Expired'] },
      date: {
        $gte: closureStartDate,
        $lte: closureEndDate,
      },
    })
    .sort({ ownerId: 1, date: 1, mealType: 1 }) 
    .exec();

    if (affectedTokens.length === 0) {
        return {
            success: true,
            message: 'No unused tokens found within the closure period to extend.',
            shiftedCount: 0,
            closureDays: daysToShift,
        };
    }
    
    //grouping by user
    const tokensByUser = affectedTokens.reduce((acc, token) => {
        const ownerId = token.ownerId.toString();
        if (!acc[ownerId]) {
            acc[ownerId] = [];
        }
        acc[ownerId].push(token);
        return acc;
    }, {});

    let totalShiftedCount = 0;

    // loop for every user
    for (const ownerId of Object.keys(tokensByUser)) {
        const tokensToShift = tokensByUser[ownerId];
        
        // finding latest existing token date for the user
        const latestExistingToken = await this.diningTokenModel.findOne({
            ownerId: new Types.ObjectId(ownerId),
            status: 'Active',
        })
        .sort({ date: -1 }) 
        .exec();

        let currentShiftDate = new Date(hallReopenDate); 

        if (latestExistingToken) {
            currentShiftDate = new Date(latestExistingToken.date);
            currentShiftDate.setDate(currentShiftDate.getDate() + 1);
        }
        
        currentShiftDate.setHours(0, 0, 0, 0); 

        const mealsPerDay = 2; 
        
        for (let i = 0; i < tokensToShift.length; i++) {
            const token = tokensToShift[i];
            
            const daysToAdd = Math.floor(i / mealsPerDay); 
            
            let finalNewDate = new Date(currentShiftDate); 
            finalNewDate.setDate(currentShiftDate.getDate() + daysToAdd);
            finalNewDate.setHours(0, 0, 0, 0); 
            
            await this.diningTokenModel.updateOne(
                { _id: token._id },
                {
                    $set: { 
                        date: finalNewDate,
                        status: 'Active', 
                        extendedReason: reason, 
                        extendedBy: new Types.ObjectId(adminId),
                        extendedOn: new Date(),
                    }
                }
            ).exec();
            
            totalShiftedCount++;
        }
    }

    return {
      success: true,
      message: `${totalShiftedCount} unused tokens have been dynamically re-activated and shifted.`,
      shiftedCount: totalShiftedCount,
      closureDays: daysToShift,
    };
  }


//for cancelling sell post

async removeListing(tokenId: string, userId: string) {
    const token = await this.diningTokenModel.findById(tokenId);
    if (!token) throw new NotFoundException('Token not found');

    if (token.ownerId.toString() !== userId) {
        throw new UnauthorizedException('Only owner can remove listing.');
    }

    if (token.status === 'Sold') {
        throw new BadRequestException('Cannot remove a sold token.');
    }

    const previousBuyerId = token.requestedBy;

    token.status = 'Active';       
    token.price = 0;               
    token.requestedBy = undefined; 
    token.paymentStatus = 'None';
    token.messages = [];           
    await token.save();

    if (previousBuyerId) {
        this.transactionsGateway.notifyBuyer(previousBuyerId.toString(), {
            title: 'Listing Removed',
            message: 'Seller removed the token from marketplace.',
            tokenId: token._id,
            status: 'Active' 
        });
    }

    return { success: true, message: 'Token removed from sale and active in your wallet.' };
}

//reject buyer request
async rejectBuyer(tokenId: string, userId: string) {
    const token = await this.diningTokenModel.findById(tokenId);
    if (!token) throw new NotFoundException('Token not found');

    if (token.ownerId.toString() !== userId) {
        throw new UnauthorizedException('Only owner can perform this action.');
    }

    if (token.status !== 'Requested') {
        throw new BadRequestException('No buyer to reject (Token is not in requested state).');
    }

    const previousBuyerId = token.requestedBy;

    token.status = 'Listed';       
    token.requestedBy = undefined; 
    token.paymentStatus = 'None';
    token.messages = [];           

    await token.save();

    if (previousBuyerId) {
        this.transactionsGateway.notifyBuyer(previousBuyerId.toString(), {
            title: 'Request Rejected ❌',
            message: 'Seller rejected your request. Chat closed.',
            tokenId: token._id,
            status: 'Listed'
        });
    }

    return { success: true, message: 'Buyer rejected. Token is listed for others.' };
}


  
  
  
}