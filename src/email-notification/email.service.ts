import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CustomLogger } from 'src/log/logs.service';

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

  async sendOTPEmail(payload: {
    to: string;
    otp: string;
    subject: string;
    type: string;
  }): Promise<boolean> {
    const htmlBody = `
  <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f4faff; border: 1px solid #d0e7ff; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://easyvolts.ng/img/logo-light.png" alt="Luxy Verification" style="width: 50%; max-width: 250px; border-radius: 8px;" />
    </div>
    <h2 style="color: #007BFF; text-align: center;">Luxy App</h2>     
    <p style="font-size: 16px; color: #333; text-align: center;">
      Please use the OTP code below to verify your email address.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 28px; font-weight: bold; color: #004085;">${payload.otp}</span>
    </div>
    <p style="font-size: 14px; color: #666; text-align: center;">
      This code will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.
    </p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #d6eaff;" />
    <p style="font-size: 12px; color: #999; text-align: center;">
      &copy; ${new Date().getFullYear()} Luxy. All rights reserved.
    </p>
  </div>
`;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const info = await this.transporter.sendMail({
        from: `"Luxy Support" <${process.env.SMTP_USER}>`,
        to: payload.to,
        subject: payload.subject,
        html: htmlBody,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.debug(`Failed to send email: ${err.message}`);
      return false;
    }
  }
}
