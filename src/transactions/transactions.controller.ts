import { Controller, Post, Get, Body, UseGuards, Request, Param, UnauthorizedException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  
  @Post('purchase')
  async createOrder(@Request() req, @Body() body: CreateTransactionDto) {
    return this.transactionsService.createOrder(req.user.sub, body);
  }

  
 
//in diner home page history fetch
  @Get('my-history')
  async getMyHistory(@Request() req) {
    return this.transactionsService.getUserTransactions(req.user.sub);
  }
  
  @Post('approve/:id')
  async approveOrder(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
        throw new UnauthorizedException('Access Denied: Only Managers Allowed');
    }
    return this.transactionsService.approveTransaction(id, req.user.sub);
  }
  @Post('reject/:id')
  async rejectOrder(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
        throw new UnauthorizedException('Access Denied');
    }
    return this.transactionsService.rejectTransaction(id, req.user.sub);
  }
  
  @Get('history')
  async getHistory(@Request() req) {
    if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
        throw new UnauthorizedException('Access Denied: Only Managers Allowed');
    }
    return this.transactionsService.getTransactionHistory(req.user.hallName);
  }

  //manager get pending requests  based on hall
  @Get('pending')
  async getPending(@Request() req) {
    
    if (req.user.role !== 'manager' && req.user.role !== 'hall_admin') {
        throw new UnauthorizedException('Access Denied: Only Managers Allowed');
    }
    
    return this.transactionsService.getPendingTransactions(req.user.hallName);
  }
}