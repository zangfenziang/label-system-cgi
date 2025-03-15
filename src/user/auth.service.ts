import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (!user || user.password !== this.usersService.addSalt(pass, user.salt)) {
      throw new UnauthorizedException();
    }
    const payload = { uid: user.uid, level: user.level };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
