import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from 'src/entity/task.model';
import {
  filterSensitive,
  User,
  UserLevel,
  UserStatus,
} from 'src/entity/user.model';
import { FindOptionsWhere, Repository, Between } from 'typeorm';
const shajs = require('sha.js');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  hash(str: string) {
    return new shajs.sha256().update(str).digest('hex');
  }

  addSalt(pass: string, salt: string) {
    return this.hash(`${pass}$A$${salt}`);
  }

  rand(length) {
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialCharacters = '!@#%&?';
    const allCharacters =
      lowerCaseLetters + upperCaseLetters + specialCharacters;

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters[randomIndex];
    }

    return password;
  }

  async check() {
    const adminName = 'admin';
    const admin = await this.usersRepository.findOne({
      where: {
        username: adminName,
      },
    });
    if (!admin) {
      const password = this.rand(16);
      const salt = this.rand(16);
      const dbPass = this.addSalt(this.hash(password), salt);
      try {
        const resp = await this.usersRepository.insert({
          username: adminName,
          password: dbPass,
          salt,
          status: UserStatus.Active,
          level: UserLevel.Admin,
        });
        if (!resp.identifiers.length) {
          console.log('create admin fail!');
          return;
        }
        console.log('create admin success, password:', password);
      } catch (err) {
        console.error(err);
        console.log('create admin fail!');
      }
    }
  }

  async findOne(params: {
    uid?: number;
    username?: string;
    needSensitive?: boolean;
  }) {
    const whereCondition: FindOptionsWhere<User> = {};
    if (params.uid) {
      whereCondition.uid = params.uid;
    }
    if (params.username) {
      whereCondition.username = params.username;
    }
    const user = await this.usersRepository.findOne({
      where: whereCondition,
    });
    return params.needSensitive ? user : filterSensitive(user);
  }

  async findAll() {
    return (await this.usersRepository.find()).map(filterSensitive);
  }

  async insert(user: User) {
    const newUser = new User();
    newUser.username = user.username;
    newUser.salt = this.rand(16);
    newUser.password = this.addSalt(user.password, newUser.salt);
    newUser.status = UserStatus.Active;
    newUser.level = user.level;
    const ret = await this.usersRepository.insert(newUser);
    return { code: ret.identifiers.length ? 0 : 1 };
  }

  async updateInfo(uid: number, info: User) {
    const user = await this.usersRepository.findOne({
      where: {
        uid,
      },
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    const { password, status, level } = info;
    const data: any = {};
    if (password) {
      data.salt = this.rand(16);
      data.password = this.addSalt(password, data.salt);
    }
    if (status) {
      data.status = status;
    }
    if (level) {
      data.level = level;
    }
    Object.assign(user, data);
    await this.usersRepository.save(user);
    return {
      code: 0,
    };
  }

  async getUserCost(id: number, query: any) {
    const begin = Number(query.begin) || 0;
    const end = Number(query.end) || Date.now();
    return await this.taskRepository.find({
      where: {
        uid: id,
        taskStatus: TaskStatus.Accept,
        finishTime: Between(new Date(begin), new Date(end)),
      },
    });
  }

  async del(uid: number) {
    return await this.usersRepository.delete({
      uid,
    });
  }
}
