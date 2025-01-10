import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthenticationGuard } from 'src/auth/guard/authGuard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { CreateNewTaskDTO } from './dtos/createNewTaskDTO';
import { Request } from 'express';
import { AssignTaskEmployeeDTO } from './dtos/assignTaskEmployeeDTO';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}
  // Get All Task :-
  @UseGuards(AuthenticationGuard)
  @Roles('ADMIN')
  @Get()
  getAllTask() {
    return this.taskService.getAllTasks();
  }

  // Get task By Id

  @UseGuards(AuthenticationGuard)
  @Roles('ADMIN')
  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getTaskById(id);
  }

  //   Post New Task :-
  @UseGuards(AuthenticationGuard)
  @Roles('MANAGER')
  @Post('createNewTask')
  createNewTask(@Body() createNewTaskDTO: CreateNewTaskDTO, @Req() req: Request) {
    return this.taskService.createNewTask(createNewTaskDTO, req);
  }

  //   Patch :- Assign task to employee :-

  @UseGuards(AuthenticationGuard)
  @Roles('MANAGER')
  @Patch('assignTask/:taskId')
  assignTaskToEmployee(
    @Body() assignTaskEmployeeDTO: AssignTaskEmployeeDTO,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: Request,
  ) {
    return this.taskService.assignTaskToEmployee(assignTaskEmployeeDTO.employeeId, taskId, req);
  }

  //  Delete any Task
  @UseGuards(AuthenticationGuard)
  @Roles('MANAGER', 'ADMIN')
  @Delete('deleteTask/:taskId')
  deleteTaskById(@Param('taskId', ParseIntPipe) taskId: number, @Req() req: Request) {
    return this.taskService.deleteTaskById(+taskId, req);
  }
}
