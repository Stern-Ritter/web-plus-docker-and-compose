import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';
import { EmailSenderModule } from '../email-sender/email-sender.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    UsersModule,
    WishesModule,
    EmailSenderModule,
  ],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [OffersService],
})
export class OffersModule {}
