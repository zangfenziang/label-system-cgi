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
      query.andWhere('status = :status', {
        status,
      });
    }
    if (uid) {
      query.andWhere('status = :uid', {
        uid,
      });
    }
    const [list, total] = await Promise.all([
      query.skip((pageNum - 1) * pageSize).take(pageSize),
      query.getCount(),
    ]);
    return {
      code: 0,
      list,
      total,
    };
  }
}
