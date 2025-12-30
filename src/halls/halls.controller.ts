import { Controller, Get, Post, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { HallsService } from './halls.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateHallDto } from './dto/create-hall.dto';

@Controller('halls')
@UseGuards(AuthGuard) 
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Get()
  async getAllHalls() {
    return this.hallsService.getAllHalls();
  }

  @Post()
  async createHallAndAdmin(@Request() req, @Body() body: { name: string, email: string, password: string, capacity: number }) {

    return this.hallsService.createHallWithAdmin(
        body.name, 
        body.email, 
        body.password, 
        body.capacity
    );
  }
  

  @Get('my-hall')
  async getMyHall(@Request() req) {
    return this.hallsService.getMyHall(req.user.sub);
  }

  @Patch('my-hall')
  async updateHallInfo(@Request() req, @Body() body: { notice: string }) {
    return this.hallsService.updateMyHallNotice(req.user.sub, body.notice);
  }
}