import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HallsController } from './halls.controller';
import { HallsService } from './halls.service';
import { Hall, HallSchema } from './schemas/hall.schema';
import { AuthModule } from '../auth/auth.module';
import { User ,UserSchema} from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hall.name, schema: HallSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [HallsController],
  providers: [HallsService],
  exports: [HallsService],
})
export class HallsModule {}