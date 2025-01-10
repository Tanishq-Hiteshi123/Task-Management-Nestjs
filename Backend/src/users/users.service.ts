import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private dataService: DatabaseService) {}

  async getAllUsers() {
    try {
      const allUsers = await this.dataService.user.findMany({
        where: {
          role: {
            not: 'ADMIN',
          },
        },
      });

      if (!allUsers) {
        throw new InternalServerErrorException('Users Data can not fetch');
      }

      return {
        success: true,
        message: 'All Users',
        allUsers,
      };
    } catch (error) {
        new InternalServerErrorException();
        throw error;
    }
  }

  async getSingleUserDetails(id: number) {
    try {
      if (!id) {
        throw new BadRequestException('Id is not provided');
      }

      const userDetails = await this.dataService.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!userDetails) {
        throw new BadRequestException('User Details not found');
      }

      return {
        success: true,
        message: 'Required User Details',
        userDetails,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  async deleteUserById(id: number) {
    try {
      if (!id) {
        throw new BadRequestException('Id is not provided');
      }

      const user = await this.dataService.user.findFirst({
        where: {
          id: id,
        },
      });

      if (user.role == 'ADMIN') {
        throw new UnauthorizedException('You can not delete user with Role ADMIN');
      }
      const userDetails = await this.dataService.user.delete({
        where: {
          id: id,
        },
      });

      if (!userDetails) {
        throw new BadRequestException('User could not deleted ');
      }

      return {
        success: true,
        message: `user with role ${userDetails.role} deleted successfully`,
        userDetails,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }
}
