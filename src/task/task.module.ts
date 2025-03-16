import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entity/task.model';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { FileController } from './file.controller';
import { User } from 'src/entity/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  controllers: [TaskController, FileController],
  providers: [TaskService],
})
export class TaskModule {}
