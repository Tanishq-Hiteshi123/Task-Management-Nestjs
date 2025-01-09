import { Body, Controller, Post } from '@nestjs/common';
import { SendMailForAuthDTO } from './dtos/sendMailForAuth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // For Registering the user :- (Admin , Manager , Employee)
  @Post('sendEmail')
  signUpUser(@Body() sendEmailForAuthDTO: SendMailForAuthDTO) {
    return this.authService.sendEmailForAuth(sendEmailForAuthDTO.email);
  }
}
