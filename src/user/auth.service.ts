import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './user.service';
const shajs = require('sha.js');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  hash(str: string) {
    return new shajs.sha256().update(str).digest('hex');
  }

  addSalt(pass: string, salt: string) {
    return this.hash(`${pass}$A$${salt}`);
  }

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (!user || user.password !== this.addSalt(pass, user.salt)) {
      throw new UnauthorizedException();
    }
    const payload = { uid: user.uid, level: user.level };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
