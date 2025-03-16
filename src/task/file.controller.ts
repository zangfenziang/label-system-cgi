import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as uuid from 'uuid';

@Controller('cgi/file')
export class FileController {
  static DIR = path.resolve('./file');
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  async get(@Param('id') id: string) {
    if (id.includes('.')) {
      throw new ForbiddenException();
    }
    const filePath = path.resolve(FileController.DIR, id);
    const resp = await fs.readFile(filePath);
    return {
      code: 0,
      content: resp.toString(),
    };
  }

  @Put('/')
  async upload(@Body() body) {
    const { content } = body;
    const file = uuid.v4();
    const filePath = path.resolve(FileController.DIR, file);
    try {
      await fs.stat(filePath);
      return { code: 1 };
    } catch {}
    await fs.writeFile(filePath, content);
    return { code: 0, id: file };
  }
}
