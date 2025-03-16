import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from 'src/entity/task.model';
import { filterSensitive, User } from 'src/entity/user.model';
import { In, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    const uidList = list.reduce((pre: number[], cur) => {
      if (!cur.uid) return pre;
      if (pre.includes(cur.uid)) return pre;
      return [...pre, cur.uid];
    }, []);
    let userList: User[] = [];
    if (uidList.length) {
      userList = await this.userRepository.find({
        where: {
          uid: In(uidList),
        },
      });
      userList = userList.map(filterSensitive);
    }
    return {
      code: 0,
      list: list.map((item) => {
        if (item.uid) {
          return {
            ...item,
            user: userList.find((user) => user.uid === item.uid),
          };
        }
        return item;
      }),
      total,
    };
  }

  conv(task: Task, newTask: Task) {
    newTask.title = task.title;
    newTask.desc = task.desc;
    newTask.cost = task.cost;
    newTask.info = task.info;
  }
  async insert(task: Task) {
    const newTask = new Task();
    this.conv(task, newTask);
    newTask.taskStatus = TaskStatus.Waiting;
    newTask.labelInfo = { files: [] };
    const ret = await this.taskRepository.insert(newTask);
    return { code: ret.identifiers.length ? 0 : 1 };
  }

  async findOne(taskId: number) {
    return await this.taskRepository.findOne({
      where: {
        taskId,
      },
    });
  }

  async save(task: Task) {
    return await this.taskRepository.save(task);
  }

  async delete(taskId: number) {
    return await this.taskRepository.delete({
      taskId,
    });
  }
}
