import { IsEmail } from 'class-validator';

export class SendMailForAuthDTO {
  @IsEmail()
  email: string;
}
