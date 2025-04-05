import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  StreamableFile,
} from '@nestjs/common';
import { TaskService } from './task.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as uuid from 'uuid';
import { createReadStream } from 'fs';
import * as tmp from 'tmp';
import { exec } from 'child_process';

@Controller('cgi/file')
export class FileController {
  static DIR = path.resolve('./file');
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  async get(@Param('id') id: string) {
    if (id.includes('..')) {
      throw new ForbiddenException();
    }
    const filePath = path.resolve(FileController.DIR, id);
    return new StreamableFile(createReadStream(filePath));
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

  @Post('/extract')
  async extract(@Body() body) {
    const tmpobj = tmp.dirSync();
    console.log('extract', tmpobj.name);
    const pyFile = path.join(tmpobj.name, 'extract_data.py');
    await fs.copyFile('./py/extract_data.py', pyFile);
    const { files } = body;
    if (files.some((file) => !/^\w{8}(-\w{4}){3}-\w{12}$/.test(file))) {
      return {
        code: 1,
      };
    }
    await Promise.all(
      files.map(async (file, index) => {
        await fs.copyFile(
          `./file/${file}`,
          path.join(tmpobj.name, `${index}.txt`),
        );
      }),
    );
    const input = new Array(4)
      .fill(0)
      .map((_, index) => `${index}.txt`)
      .join(' ');
    const execStr = `python3 extract_data.py ${input}`;
    await new Promise((resolve, reject) => {
      exec(
        execStr,
        {
          cwd: tmpobj.name,
        },
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        },
      );
    });
    const conn = path.join(tmpobj.name, 'conn_data.json');
    const meta = path.join(tmpobj.name, 'meta_data.json');
    const [connFile, metaFile] = await Promise.all([
      fs.readFile(conn),
      fs.readFile(meta),
    ]);
    return {
      conn: connFile.toString(),
      meta: metaFile.toString(),
      code: 0,
    };
  }

  @Post('/export')
  async export(@Body() body) {
    const tmpobj = tmp.dirSync();
    console.log('export', tmpobj.name);
    const pyFile = path.join(tmpobj.name, 'export_data.py');
    await fs.copyFile('./py/export_data.py', pyFile);
    const { files } = body;
    if (files.some((file) => !/^\w{8}(-\w{4}){3}-\w{12}$/.test(file))) {
      return {
        code: 1,
      };
    }
    await Promise.all(
      files.map(async (file, index) => {
        await fs.copyFile(
          `./file/${file}`,
          path.join(tmpobj.name, `${index}.json`),
        );
      }),
    );
    const input = new Array(1)
      .fill(0)
      .map((_, index) => `${index}.json`)
      .join(' ');
    const execStr = `python3 export_data.py ${input}`;
    await new Promise((resolve, reject) => {
      exec(
        execStr,
        {
          cwd: tmpobj.name,
        },
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          if (stderr) {
            console.error('exec', execStr, 'err:', stderr);
          }
          resolve(stdout);
        },
      );
    });
    const furniture = path.join(tmpobj.name, 'furniture_data.txt');
    const orientation = path.join(tmpobj.name, 'orientation_tables.txt');
    const connection = path.join(tmpobj.name, 'connection_tables.txt');
    const [furnitureFile, orientationFile, connectionFile] = await Promise.all([
      fs.readFile(furniture),
      fs.readFile(orientation),
      fs.readFile(connection),
    ]);
    return {
      furniture: furnitureFile.toString(),
      orientation: orientationFile.toString(),
      connection: connectionFile.toString(),
      code: 0,
    };
  }
}
