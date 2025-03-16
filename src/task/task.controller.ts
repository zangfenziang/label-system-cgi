import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Auth } from 'src/user/auth.guard';
import { UserLevel } from 'src/entity/user.model';
import { IRequest } from 'src/type';

@Controller('cgi/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(@Query() query, @Request() req: IRequest) {
    const { status, pageSize, pageNum } = query;
    const data: any = {
      pageSize,
      pageNum,
    };
    if (status === 'all') {
    } else if (status === 'self') {
      data.uid = req.user.uid;
    } else {
      data.status = status;
    }
    return this.taskService.findAll(data);
  }

  @Post(':id/lock')
  lock() {}

  @Post(':id/apply')
  apply() {}

  @Auth(UserLevel.Admin)
  @Put()
  create(@Body() body) {
    return this.taskService.insert(body);
  }

  @Auth(UserLevel.Admin)
  @Post(':id/status')
  changeStatus() {}

  @Auth(UserLevel.Admin)
  @Delete(':id')
  del() {}
}
