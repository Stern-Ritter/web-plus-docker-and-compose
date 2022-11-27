import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailSender {
  constructor(private configService: ConfigService) {}

  async sendEmail(mails: string[], message: string) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_SENDER_HOST'),
      port: this.configService.get('EMAIL_SENDER_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_SENDER_USER'),
        pass: this.configService.get('EMAIL_SENDER_PASSWORD'),
      },
    });

    const toMailString = mails.join(', ');

    await transporter.sendMail({
      from: this.configService.get('EMAIL_SENDER_USER'),
      to: toMailString,
      subject: 'Сбор денег на подарок "Купи Подари Дай"',
      text: `${message}`,
    });
  }
}
