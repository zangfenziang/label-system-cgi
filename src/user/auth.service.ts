import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne({
      username,
      needSensitive: true,
    });
    if (!user || user.password !== this.usersService.addSalt(pass, user.salt)) {
      throw new UnauthorizedException();
    }
    const payload = { uid: user.uid, level: user.level };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
