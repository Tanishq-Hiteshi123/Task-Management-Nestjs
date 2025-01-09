import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/common/entity/user.entity';

export class VerifyEmailOTPDTO {
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: string;
}
