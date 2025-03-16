import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entity/task.model';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(dto) {
    const { status, pageSize = 10, pageNum = 1, uid } = dto;
    const query = this.taskRepository.createQueryBuilder().select();
    if (status) {
      query.andWhere('taskStatus = :status', {
        status,
      });
    }
    if (uid) {
      query.andWhere('uid = :uid', {
        uid,
      });
    }
    const [list, total] = await Promise.all([
      query
        .skip((pageNum - 1) * pageSize)
        .take(pageSize)
        .getMany(),
      query.getCount(),
    ]);
    return {
      code: 0,
      list,
      total,
    };
  }

  async insert(task: Task) {
    const newTask = new Task();
    newTask.title = task.title;
    newTask.desc = task.desc;
    newTask.cost = task.cost;
    newTask.info = task.info;
    const ret = await this.taskRepository.insert(newTask);
    return { code: ret.identifiers.length ? 0 : 1 };
  }
}
