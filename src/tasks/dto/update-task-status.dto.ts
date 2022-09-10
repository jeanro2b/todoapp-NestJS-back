import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatutsDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
