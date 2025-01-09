import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class MailService {
  transporter: nodeMailer.Transporter;

  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: `smtp.gmail.com`,
      port: 587,
      auth: {
        user: 'tanishq.yadav@hiteshi.com',
        pass: 'vxhk ezfd izll hxnm',
      },
    });
  }

  async sendPasswordResetEmail(sendTo: string, otp: string): Promise<boolean> {
    let isMailsend = true;
    try {
      const mailOptions = {
        from: `Auth Backend Service`,
        to: sendTo,
        subject: 'Email Verification',
        html: `<p> your OTP : ${otp} </p>`,
      };

      console.log(mailOptions);

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      isMailsend = false;
      throw new InternalServerErrorException(error);
    } finally {
      return isMailsend;
    }
  }
}
