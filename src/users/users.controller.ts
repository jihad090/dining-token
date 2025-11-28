import { Controller, Post, Body, UseGuards, Request, UnauthorizedException, Get ,Query, NotFoundException} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard'; 
import * as bcrypt from 'bcrypt';

@UseGuards(AuthGuard) 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('submit-profile')
  async submitProfile(@Request() req, @Body() body: any) {
    const userId = req.user.sub;
    
    return this.usersService.updateProfile(userId, {
      phoneNumber: body.phoneNumber,
      nidNumber: body.nidNumber,
      status: 'pending' 
    });
  }
  
  @Post('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }


  @Get('find-student')
  async findStudent(@Request() req, @Query('email') email: string) {
    if (req.user.role !== 'hall_admin') throw new UnauthorizedException();
    
    const user = await this.usersService.findOne(email);
    if (!user) throw new NotFoundException('Student not found');
    
    const { password, ...result } = user.toObject();
    return result;
  }

  @Post('promote-student')
  async promoteStudent(@Request() req, @Body() body: { email: string }) {
    if (req.user.role !== 'hall_admin') throw new UnauthorizedException();

    return this.usersService.changeUserRole(
        body.email, 
        'manager', 
        req.user.hallName
    );
  }

  @UseGuards(AuthGuard)
  @Post('demote-manager')
  async demoteManager(@Request() req, @Body() body: { email: string }) {
    if (req.user.role !== 'hall_admin') throw new UnauthorizedException();

    return this.usersService.changeUserRole(
        body.email, 
        'user', 
        req.user.hallName
    );
  }


  @Get('my-managers')
  async getMyManagers(@Request() req) {
    return this.usersService.findUsersByHallAndRole(req.user.hallName, 'manager');
  }

  @Post('add-dining-boy')
  async addDiningBoy(@Request() req, @Body() body: any) {
    if (req.user.role !== 'manager') {
        throw new UnauthorizedException('Only Managers can add dining boys');
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    return this.usersService.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: 'dining_boy',
        hallName: req.user.hallName,
        status: 'verified'
    });
  }
  @Get('my-dining-boys')
async getMyDiningBoys(@Request() req) {
  return this.usersService.findUsersByHallAndRole(req.user.hallName, 'dining_boy');
}

@Post('remove-dining-boy')
  async removeDiningBoy(@Request() req, @Body() body: { email: string }) {
    if (req.user.role !== 'manager') {
        throw new UnauthorizedException('Only managers can remove staff');
    }

    return this.usersService.removeDiningBoy(body.email);
  }

}