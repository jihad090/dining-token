
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiningToken, DiningTokenSchema } from './schemas/dining-token.schema';
import { DiningTokenService } from './dining-token.service';
import { DiningTokenController } from './dining-token.controller';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { TransactionsGateway } from 'src/transactions/transactions.gateway';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiningToken.name, schema: DiningTokenSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [DiningTokenController],
  providers: [DiningTokenService,TransactionsGateway],
  exports: [DiningTokenService], 
})
export class DiningTokenModule {}