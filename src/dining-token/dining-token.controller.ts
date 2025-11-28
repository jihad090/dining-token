import { Controller, Post, Get, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { DiningTokenService } from './dining-token.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('dining-token')
@UseGuards(AuthGuard) 
export class DiningTokenController {
  constructor(private readonly diningTokenService: DiningTokenService) {}

  @Post('scan')
  async scanToken(@Request() req, @Body() body: { tokenID: string }) {
    
   
    return this.diningTokenService.scanToken(body.tokenID, req.user.sub);
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
    return this.diningTokenService.getDiningBoyScanHistory(req.user.sub);
  }

}