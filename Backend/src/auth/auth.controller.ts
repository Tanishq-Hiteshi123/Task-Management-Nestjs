import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SendMailForAuthDTO } from './dtos/sendMailForAuth.dto';
import { AuthService } from './auth.service';
import { VerifyEmailOTPDTO } from './dtos/verifyEmailOTPDTO';
import { Request } from 'express';
import { AuthenticationGuard } from './guard/authGuard';
import { Roles } from './decorator/role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // For Registering the user :- (Admin , Manager , Employee)
  @Post('sendEmail')
  signUpUser(@Body() sendEmailForAuthDTO: SendMailForAuthDTO) {
    console.log(sendEmailForAuthDTO);
    return this.authService.sendEmailForAuth(sendEmailForAuthDTO.email);
  }

  @Post('verifyEmail')
  verifyEmail(@Body() verifyEmailOTPDTO: VerifyEmailOTPDTO) {
    return this.authService.verifyEmailOTP(verifyEmailOTPDTO);
  }

  @UseGuards(AuthenticationGuard)
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER')
  @Get('getMe')
  getMyProfile(@Req() req: Request) {
    return this.authService.getMe(req);
  }
}
