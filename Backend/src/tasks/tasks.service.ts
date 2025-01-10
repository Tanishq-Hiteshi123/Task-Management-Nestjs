import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateNewTaskDTO } from './dtos/createNewTaskDTO';
import { Request } from 'express';
@Injectable()
export class TasksService {
  constructor(private databaseService: DatabaseService) {}
  // Get all Task

  async getAllTasks() {
    try {
      const allTasksList = await this.databaseService.task.findMany();

      if (!allTasksList) {
        throw new InternalServerErrorException('No List found');
      }

      return {
        success: true,
        message: 'All Tasks List',
        allTasksList,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  //   Get Task By Id :-
  async getTaskById(id: number) {
    try {
      if (!id) {
        throw new BadRequestException('Id for single Task is not provided');
      }
      const singleTask = await this.databaseService.task.findFirst({
        where: {
          id,
        },
      });

      if (!singleTask) {
        throw new NotFoundException('Task with requested Id not found');
      }

      if (!singleTask) {
        throw new InternalServerErrorException('No Task found');
      }

      return {
        success: true,
        message: 'Task Details',
        singleTask,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  //   Create New Task :-
  async createNewTask(createNewTaskDetails: CreateNewTaskDTO, req: Request) {
    try {
      const { title, description } = createNewTaskDetails;

      const managerId = req.user?.userId;

      const managerRole = req.user?.role;

      if (managerRole != 'MANAGER') {
        throw new UnauthorizedException('Only Manager is allowed to create the Task');
      }

      const managerDetails = await this.databaseService.user.findUnique({
        where: {
          id: +managerId,
        },
      });

      if (!managerDetails) {
        throw new NotFoundException('Manager Details not found');
      }

      if (!title || !description) {
        throw new BadRequestException('Title and Description both are required Field');
      }

      //   Creating new Task :-
      const newTask = await this.databaseService.task.create({
        data: {
          title,
          description,
          creatorId: managerId,
        },
      });

      if (!newTask) {
        throw new InternalServerErrorException('Task Could not be created');
      }

      return {
        success: true,
        message: 'Task Created SuccessFully',
        newTask,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  //   Assign Task to the Employee :-
  async assignTaskToEmployee(employeeId: number, taskId: number, req: Request) {
    try {
      if (!employeeId) {
        throw new BadRequestException('Employee Id is not provided');
      }
      if (!taskId) {
        throw new BadRequestException('Task Id is not provided');
      }

      const managerId = req.user?.userId;
      const managerRole = req.user?.role;

      if (!managerRole) {
        throw new UnauthorizedException('Only Manager can access this');
      }

      const managerDetails = await this.databaseService.user.findUnique({
        where: {
          id: +managerId,
        },
      });

      if (!managerDetails) {
        throw new NotFoundException('Manager Details not found');
      }

      const taskDetails = await this.databaseService.task.findUnique({
        where: {
          id: +taskId,
        },
      });

      if (!taskDetails) {
        throw new NotFoundException('Task Details not found');
      }

      if (taskDetails.creatorId != managerId) {
        throw new UnauthorizedException('You Are not the creator this Task');
      }

      //   Assign Task :-
      const isAssigned = await this.databaseService.task.update({
        data: {
          assigneeId: employeeId,
        },
        where: {
          id: taskId,
        },
      });

      if (!isAssigned) {
        throw new InternalServerErrorException('Task assignation failed');
      }

      return {
        success: true,
        message: `Task with id : ${taskId} to the employee with Id : ${employeeId}`,
        isAssigned,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  //   Delete Task By Id :-
  async deleteTaskById(taskId: number, req: Request) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!taskId) {
        throw new BadRequestException('Task Id is not provided');
      }

      const taskDetails = await this.databaseService.task.findFirst({
        where: {
          id: +taskId,
        },
      });

      if (!taskDetails) {
        throw new NotFoundException('Task Details not found');
      }

      if (userRole == 'ADMIN') {
        // Directly delete the task :-
        const deletedTask = await this.databaseService.task.delete({
          where: {
            id: +taskId,
          },
        });

        if (!deletedTask) {
          throw new InternalServerErrorException('Task could not get deleted');
        }

        return {
          success: true,
          message: `Task of id : ${taskId} Deleted by ${userRole}  `,
          deletedTask,
        };
      } else {
        //  it is a manager :-
        // check the task going to delete is created by this manager :-
            if (taskDetails.creatorId != userId) {
          throw new UnauthorizedException('You were not the creator this task ');
        }

        const deletedTask = await this.databaseService.task.delete({
          where: {
            id: +taskId,
          },
        });

        if (!deletedTask) {
          throw new InternalServerErrorException('Task could not get deleted');
        }

        return {
          success: true,
          message: `Task of id : ${taskId} Deleted by ${userRole}  `,
          deletedTask,
        };
      }
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }
}
