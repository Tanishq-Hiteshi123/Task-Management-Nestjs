import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailService } from 'src/common/services/mail.service';
import { DatabaseService } from 'src/database/database.service';
import { generateOTP } from 'src/utils/generateOTPForEmail';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private mailService: MailService,
  ) {}

  // Controller for registering the User :-
  public async sendEmailForAuth(email: string) {
    try {
      if (!email) {
        throw new BadRequestException('Please Provide the email');
      }

      const isUserExist = await this.databaseService.user.findFirst({
        where: {
          email,
        },
      });

      //   Generate The OTP for the User on Email
      const otp = generateOTP();

      //   Sending the mail on OTP :-

      const isMailsend = await this.mailService.sendPasswordResetEmail(
        email,
        otp,
      );

      if (!isMailsend) {
        throw new InternalServerErrorException('Could not sent mail');
      }

      let updatedUser: any;
      const expiryDate = new Date();

      expiryDate.setHours(expiryDate.getHours() + 1);
      if (isUserExist) {
        updatedUser = await this.databaseService.user.update({
          where: {
            email,
          },
          data: {
            otp,
            otpExpiry: expiryDate,
          },
        });
      } else {
        updatedUser = await this.databaseService.user.create({
          data: {
            email,
            otp,
            otpExpiry: expiryDate,
          },
        });
      }

      return {
        success: true,
        message: 'Mail Sent On your Email',
        isFirstTime: isUserExist ? false : true,
        userDetails: updatedUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
