import { Controller, Param,Post, Get, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
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
  @Post('sell')
  async sellToken(@Request() req, @Body() body: { tokenID: string, price: number }) {
    return this.diningTokenService.listToken(body.tokenID, req.user.sub, body.price);
  }
  @Get('marketplace')
  async getMarketplace(@Request() req) {
    return this.diningTokenService.getMarketplace(req.user.sub);
  }

  @Get('my-sales') 
  async getMySales(@Request() req) {
    return this.diningTokenService.getMySellPosts(req.user.sub);
  }
  
  @Get('my-sales-history')
  async getMySalesHistory(@Request() req) {
    return this.diningTokenService.getMySoldHistory(req.user.sub);
  }
  @Post('buy-request')
  async buyRequest(@Request() req, @Body() body: { id: string }) {
    return this.diningTokenService.requestToken(body.id, req.user.sub);
  }

  @Post('confirm-sell')
  async confirmSell(@Request() req, @Body() body: { id: string }) {
    return this.diningTokenService.confirmSell(body.id, req.user.sub);
  }

  @Post('chat/send')
  async sendMessage(@Request() req, @Body() body: { tokenID: string, text: string }) {
    return this.diningTokenService.sendChatMessage(body.tokenID, req.user.sub, body.text);
  }

  @Get('chat/:id')
  async getMessages(@Param('id') id: string) {
      return this.diningTokenService.getChatMessages(id);
  }
  @Post('mark-paid')
async markPaid(@Request() req, @Body() body: { tokenID: string }) {
  return this.diningTokenService.markTokenAsPaid(body.tokenID, req.user.sub);
}

@Post('remove-listing')
  async removeListing(@Request() req, @Body() body: { id: string }) {
    return this.diningTokenService.removeListing(body.id, req.user.sub);
  }

  @Post('reject-buyer')
  async rejectBuyer(@Request() req, @Body() body: { id: string }) {
    return this.diningTokenService.rejectBuyer(body.id, req.user.sub);
  }
}