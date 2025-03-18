import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Auth } from 'src/user/auth.guard';
import { UserLevel } from 'src/entity/user.model';
import { IRequest } from 'src/type';
import { TaskStatus } from 'src/entity/task.model';

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
    return this.taskService.findAll(data, req);
  }

  @Post(':id/lock')
  async lock(@Param('id') id: string, @Request() req: IRequest) {
    const task = await this.taskService.findOne(+id);
    if (task.taskStatus !== TaskStatus.Waiting) {
      throw new ForbiddenException('task status illegal');
    }
    task.uid = req.user.uid;
    task.taskStatus = TaskStatus.Lock;
    await this.taskService.save(task);
    return { code: 0 };
  }

  @Post(':id/unlock')
  async unlock(@Param('id') id: string, @Request() req: IRequest) {
    const task = await this.taskService.findOne(+id);
    if (task.taskStatus !== TaskStatus.Lock) {
      throw new ForbiddenException('task status illegal');
    }
    if (task.uid !== req.user.uid && req.user.level !== UserLevel.Admin) {
      throw new ForbiddenException('user illegal');
    }
    task.uid = 0;
    task.taskStatus = TaskStatus.Waiting;
    await this.taskService.save(task);
    return { code: 0 };
  }

  @Post(':id/apply')
  async apply(@Param('id') id: string, @Request() req: IRequest, @Body() body) {
    const task = await this.taskService.findOne(+id);
    if (![TaskStatus.Lock, TaskStatus.Reject].includes(task.taskStatus)) {
      throw new ForbiddenException('task status illegal');
    }
    if (task.uid !== req.user.uid) {
      throw new ForbiddenException('user illegal');
    }
    task.labelInfo = body;
    task.taskStatus = TaskStatus.Audit;
    await this.taskService.save(task);
    return { code: 0 };
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Request() req: IRequest) {
    const task = await this.taskService.findOne(+id);
    if (task.taskStatus !== TaskStatus.Audit) {
      throw new ForbiddenException('task status illegal');
    }
    if (task.uid !== req.user.uid) {
      throw new ForbiddenException('user illegal');
    }
    task.taskStatus = TaskStatus.Lock;
    await this.taskService.save(task);
    return { code: 0 };
  }

  @Auth(UserLevel.Admin)
  @Put()
  create(@Body() body) {
    return this.taskService.insert(body);
  }

  @Auth(UserLevel.Admin)
  @Post(':id/status')
  async changeStatus(@Param('id') id: string, @Body() body) {
    const task = await this.taskService.findOne(+id);
    if (task.taskStatus !== body.from) {
      throw new ForbiddenException('task status illegal');
    }
    task.taskStatus = body.to;
    if (body.to === TaskStatus.Accept) {
      task.finishTime = new Date();
    }
    await this.taskService.save(task);
    return { code: 0 };
  }

  @Auth(UserLevel.Admin)
  @Post(':id')
  async update(@Param('id') id: string, @Body() body) {
    const task = await this.taskService.findOne(+id);
    this.taskService.conv(body, task);
    await this.taskService.save(task);
    return { code: 0 };
  }

  @Auth(UserLevel.Admin)
  @Delete(':id')
  async del(@Param('id') id: string) {
    await this.taskService.delete(+id);
    return { code: 0 };
  }
}
