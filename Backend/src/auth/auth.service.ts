import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailService } from 'src/common/services/mail.service';
import { DatabaseService } from 'src/database/database.service';
import { generateOTP } from 'src/utils/generateOTPForEmail';
import { VerifyEmailOTPDTO } from './dtos/verifyEmailOTPDTO';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private mailService: MailService,
    private jwtService : JwtService
  ) {}

  // Controller for registering the User :-
  public async sendEmailForAuth(email: string) {
    console.log('This email', email)
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

      let updatedUser: unknown;
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


  // Controller for verifying the email :-
  public async verifyEmailOTP(verifyEmailOTPDTO : VerifyEmailOTPDTO) {
    
      try {
       
          const {email , otp , fullName , role} = verifyEmailOTPDTO;
        
          if (!email || !otp) {
              throw new BadRequestException("Email and Otp fields are required");
          }

          // Find the user through email :-
          console.log(email , otp , fullName , role)
           const userDetails = await this.databaseService.user.findUnique({
            where : {
               email : email
            }
           })



           if (!userDetails) {
              throw new NotFoundException("User Not Found")
           }

          // Verify OTP :- (WITH DATE) :-

          if (userDetails.otp != otp) {
              throw new BadRequestException("Otp is invalid")
          }

          if (new Date() > new Date(userDetails.otpExpiry)) {
              throw new BadRequestException("Otp is invalid")
          }
          


          // UPdate OTP field & fullName and email (if required) :-
          enum Role {
            ADMIN = 'ADMIN',
            MANAGER = 'MANAGER',
            EMPLOYEE = 'EMPLOYEE',
          }

          
          const updatedUserDetails = await this.databaseService.user.update({
              data : {
                 otp : null,
                 otpExpiry : null,
                 fullName : fullName || userDetails.fullName,
                 role: role ? { set: role as Role } : userDetails.role, 
              },
              where : {
                 id : userDetails.id
              }

          })


        // Generate the Token :-
        const token = this.jwtService.sign({userId : updatedUserDetails.id , role : userDetails.role , email : userDetails.email})
         
          return {
             success : true,
             updatedUserDetails,
             token
          }

        
      }
      catch (error) {
         throw new InternalServerErrorException(error)
      }

  } 


  // Controller for getting my Own Profile
   public async getMe (req : Request) {
       try {
        
          const userId = req?.user?.userId;
          console.log("userId " , userId)

          if (!userId) {
             throw new UnauthorizedException("User Id not found");
          }

          const userDetails = await this.databaseService.user.findUnique({
              where : {
                 id : userId
              }
          })


          if (!userDetails) {
              throw new HttpException("Auth User not found" , HttpStatus.NOT_FOUND)
          }

          return {
             success : true,
             message : "Your Profile Details",
             userDetails
          }

       }
       catch(error) {
           throw new InternalServerErrorException(error)
       }
   }



}
