import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { MailService } from 'src/common/services/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './guard/roleGuard';

@Module({
  imports : [JwtModule.register({
    global : true,
    secret : process.env.JWT_SECRET,
    signOptions : {
      expiresIn : "10h"
    }
 })],
  providers: [AuthService, DatabaseService, MailService , {
     provide : APP_GUARD,
     useClass : RoleGuard
  }],
  controllers: [AuthController],
})
export class AuthModule {}
