import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entity/task.model';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { FileController } from './file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController, FileController],
  providers: [TaskService],
})
export class TaskModule {}
