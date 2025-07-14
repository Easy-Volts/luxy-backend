import { Injectable } from '@nestjs/common';
import { Message } from 'amqplib';
import * as nodemailer from 'nodemailer';
import { CustomLogger } from 'src/log/logs.service';
import { Channel } from 'amqplib';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext(EmailService.name);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'chiorlujack@gmail.com',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendOTPEmail(
    to: string,
    otp: string,
    subject: string,
    channel: Channel,
    msg: Message,
  ) {
    const htmlBody = `
      <h2>Email Verification - Luxy</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const info = await this.transporter.sendMail({
        from: `"Luxy Support" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: htmlBody,
      });
      channel.ack(msg);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      const err = error as Error;
      this.logger.debug(`Failed to send email: ${err.message}`);

      channel.nack(msg, false, false);
      throw err;
    }
  }
}
