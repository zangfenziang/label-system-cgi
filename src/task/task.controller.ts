import { Body, Controller, Post } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('cgi/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
}
