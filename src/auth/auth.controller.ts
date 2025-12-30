
//This file is API of registration and sign in 

import { Body, Controller, Post,UseGuards, Request, Get, Req,Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
@Controller('auth') 
export class AuthController {
  constructor(private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService
  ) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
@Get('profile')
@UseGuards(AuthGuard('jwt')) 
 async getProfile(@Request() req) {
    
return this.usersService.findById(req.user.sub);
}
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.signIn(body.email, body.password);
  }
@Get('google')
  @UseGuards(AuthGuard('google')) 
  async googleAuth(@Request() req) {
  }
  
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))

  async googleAuthRedirect(@Req() req, @Res() res) {
    const { access_token } = req.user;
const frontendUrl = this.configService.get<string>('FRONTEND_REDIRECT_HOST');
// return  res.redirect(`${frontendUrl}/--/google-auth-callback?token=${access_token}`);//for manually ip address
return res.redirect(`${frontendUrl}google-auth-callback?token=${access_token}`);//for live server

  }



  //only first time run
  @Get('seed-admin') 
  async seedAdmin() {
    const existingAdmin = await this.usersService.findOne('provost@cuet.ac.bd');
    if (existingAdmin) {
        return { message: 'Admin already exists!' };
    }

    const hashedPassword = await bcrypt.hash("admin123", 10); 
    
    const newAdmin = await this.usersService.create({
      name: "Provost Sir",
      email: "provost@cuet.ac.bd",
      password: hashedPassword,
      role: "hall_admin", 
      hallName: "Muktijoddha Hall",
      status: "verified"
    });

    return { message: 'Admin Created Successfully!', admin: newAdmin };
  }

  
  @Get('success')
async googleAuthSuccess(@Req() req) {
 const token = req.query.token;
return { 
 message: 'Google Login Successful! Use the token below to test APIs.', 
 access_token: token 
 };
}

}