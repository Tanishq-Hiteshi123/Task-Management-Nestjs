import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewTaskDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
