import { Module,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; 
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { DiningTokenModule } from '../dining-token/dining-token.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    DiningTokenModule,
    
  ],
  controllers: [UsersController], 
    providers: [UsersService],      
  exports: [UsersService],        
})
export class UsersModule {}