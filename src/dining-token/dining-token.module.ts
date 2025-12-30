
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiningToken, DiningTokenSchema } from './schemas/dining-token.schema';
import { DiningTokenService } from './dining-token.service';
import { DiningTokenController } from './dining-token.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiningToken.name, schema: DiningTokenSchema },
    ]),
    AuthModule,
  ],
  controllers: [DiningTokenController],
  providers: [DiningTokenService],
  exports: [DiningTokenService], 
})
export class DiningTokenModule {}