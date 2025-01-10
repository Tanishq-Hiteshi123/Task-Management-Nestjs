import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignTaskEmployeeDTO {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;
}
