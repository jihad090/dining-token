import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { DiningTokenModule } from './dining-token/dining-token.module'; 
import { TransactionsModule } from './transactions/transactions.module';
import { HallsModule } from './halls/halls.module';
@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), 
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    DiningTokenModule,
    TransactionsModule,
    HallsModule,
  ],
})
export class AppModule {}