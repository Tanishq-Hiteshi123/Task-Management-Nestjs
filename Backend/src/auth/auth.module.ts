import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { MailService } from 'src/common/services/mail.service';

@Module({
  providers: [AuthService, DatabaseService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
