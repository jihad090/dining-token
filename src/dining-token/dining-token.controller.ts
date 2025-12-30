import { Controller, Post, Get, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { DiningTokenService } from './dining-token.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('dining-token')
@UseGuards(AuthGuard) 
export class DiningTokenController {
  constructor(private readonly diningTokenService: DiningTokenService) {}

  @Post('scan')
  async scanToken(@Request() req, @Body() body: { tokenID: string }) {
    
   const scannerHall = req.user.hallName || req.user.hallId;
   
   if (!scannerHall) {
        throw new UnauthorizedException('Scanner Hall ID not found in user session.');
    }
    return this.diningTokenService.scanToken(
        body.tokenID, 
        req.user.sub, 
        req.user.role,
        scannerHall
    );
  }

  @Get('my-status')
  async getMyStatus(@Request() req) {
    return this.diningTokenService.getMyTokenStatus(req.user.sub);
  }
  @Get('upcoming')
  async getUpcoming(@Request() req) {
    return this.diningTokenService.getUpcomingTokens(req.user.sub);
  }

  @Get('history')
  async getHistory(@Request() req) {
    const userId = req.user.sub || req.user.id;
    if (!userId) throw new UnauthorizedException('Invalid user token');
    return this.diningTokenService.getTokenHistory(userId);
  }
  @Get('dining-boy/history')
  async getDiningBoyHistory(@Request() req) {
    if (req.user.role !== 'dining_boy' && req.user.role !== 'manager') {
       throw new UnauthorizedException('Only Dining Boys and Managers can view scan history');
    }
    return this.diningTokenService.getDiningBoyScanHistory(req.user.sub);
  }
  
  @Post('extend-closure')
async extendClosure(@Request() req, @Body() body: { startDate: string, endDate: string, reason: string }) {
    if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
        throw new UnauthorizedException('Access Denied: Only Manager or Hall Admin Allowed to extend tokens');
    }

    return this.diningTokenService.handleEmergencyExtension(
        body.startDate,
        body.endDate,
        body.reason,
        req.user.sub
    );
  }
}