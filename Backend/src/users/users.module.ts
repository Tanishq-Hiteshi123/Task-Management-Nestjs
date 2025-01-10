import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/guard/roleGuard';

@Module({
  imports: [DatabaseModule],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
