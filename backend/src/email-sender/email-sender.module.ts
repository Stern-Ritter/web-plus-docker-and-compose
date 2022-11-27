import { Module } from '@nestjs/common';
import { EmailSender } from './email-sender.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [EmailSender],
  exports: [EmailSender],
})
export class EmailSenderModule {}
