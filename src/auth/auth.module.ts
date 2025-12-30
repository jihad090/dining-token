
//build all connections with user model for auth module

import { Module,forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; 
import { AuthGuard } from './auth.guard';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './google.strategy'; 
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; 


@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'FALLBACK_SECRET_IF_ENV_FAILS', 
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController], 
  providers: [AuthService,
             GoogleStrategy,
             JwtStrategy,
              AuthGuard],
  exports: [AuthService,AuthGuard,JwtModule], 
})
export class AuthModule {}