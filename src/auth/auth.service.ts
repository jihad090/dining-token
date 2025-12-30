
//handle api logic for registration and sign in 

import { Injectable, UnauthorizedException ,ConflictException} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService      
  ) {}

  async register(userDto: any) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
   try {
      return await this.usersService.create({
        ...userDto,
        password: hashedPassword,
        status: 'new', 
        tokens: 0,
      });

    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('email already exists.Please use a different email');
      }
      throw error; 
    }
  }

  async signIn(email: string, pass: string) {
    const user: any = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
       throw new UnauthorizedException('Please login with Google');
    }

    return this.generateToken(user);
  }

  async googleLogin(googleUser: any) {
    let user: any = await this.usersService.findOne(googleUser.email);

    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        name: googleUser.firstName + ' ' + googleUser.lastName,
        googleId: googleUser.id, 
        avatar: googleUser.picture,
        status: 'new', 
        tokens: 0,
        hallName: null,
        role: 'user',
      });
    }
    return this.generateToken(user);
  }

  private async generateToken(user: any) {
    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role,
      status: user.status ,
      hallName: user.hallName || null
    };

    

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status, 
        role: user.role,
        hallName: user.hallName
      },
    };
  }
}