import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticationGuard } from 'src/auth/guard/authGuard';
import { Roles } from 'src/auth/decorator/role.decorator';

@UseGuards(AuthenticationGuard)
@Roles('ADMIN')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  // For Admin :-

  // GET  /users

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  //GET  /users/:id

  @Get(':id')
  getSingleUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getSingleUserDetails(id);
  }
  //POST  /users

  //DELETE  /users/:id

  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUserById(id);
  }
}
