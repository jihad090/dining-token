import { Controller, Post, Body, UseGuards, Request, UnauthorizedException, Get ,Query, NotFoundException} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard'; 
import * as bcrypt from 'bcrypt';
import { DiningTokenService } from 'src/dining-token/dining-token.service';

@UseGuards(AuthGuard) 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
  private readonly diningTokenService: DiningTokenService
  ) {}

  @Post('submit-profile')
  @UseGuards(AuthGuard) 

  async submitProfile(@Request() req, @Body() body: any) {
    const userId = req.user.sub;
    
    return this.usersService.updateProfile(userId, {
      phoneNumber: body.phoneNumber,
      nidNumber: body.nidNumber,
      status: 'pending' 
    });
  }
  
  @Post('profile')
  @UseGuards(AuthGuard) 

  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }


  

  @Get('find-student')
  async findStudent(@Request() req, @Query('email') email: string) {
    
    if (req.user.role !== 'hall_admin') {
        throw new UnauthorizedException();
    }
    
    const user = await this.usersService.findStudentInHall(email, req.user.hallName);
    
    if (!user) {
        throw new NotFoundException('Student not found in your hall');
    }
    
    return user;
  }

    @UseGuards(AuthGuard)
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

    const updatedUser = await this.usersService.changeUserRole(
        body.email, 
        'user', 
        req.user.hallName
    );
    
    return { 
        success: true, 
        message: 'Manager demoted and free tokens revoked.', 
        user: updatedUser 
    };
  }


 @Get('my-managers')
  async getMyManagers(@Request() req) {
    const admin = await this.usersService.findById(req.user.sub);
    
    if (!admin || !admin.hallName) {
        throw new NotFoundException("Hall information not found for this admin");
    }

    return this.usersService.findUsersByHallAndRole(admin.hallName, 'manager');
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