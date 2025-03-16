import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserLevel, UserStatus } from 'src/entity/user.model';
import { FindOptionsWhere, Repository } from 'typeorm';
const shajs = require('sha.js');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

  filterSensitive(user: User) {
    delete user.password;
    delete user.salt;
    return user;
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
    return params.needSensitive ? user : this.filterSensitive(user);
  }

  async findAll() {
    return (await this.usersRepository.find()).map(this.filterSensitive);
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
      data.password = password;
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
}
