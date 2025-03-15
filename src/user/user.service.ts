import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserLevel, UserStatus } from 'src/entity/user.model';
import { Repository } from 'typeorm';
const shajs = require('sha.js');

@Injectable()
export class UsersService {
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

  async findOne(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    return user;
  }
}
