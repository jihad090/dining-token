import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { AuthModule } from '../auth/auth.module';
import { DiningTokenModule } from '../dining-token/dining-token.module'; 
import { TransactionsGateway } from './transactions.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    AuthModule,
    DiningTokenModule,
     
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService,TransactionsGateway],
})
export class TransactionsModule {}