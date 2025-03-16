import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserStatus } from 'src/entity/user.model';

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
    if (
      !user ||
      user.status !== UserStatus.Active ||
      user.password !== this.usersService.addSalt(pass, user.salt)
    ) {
      throw new ForbiddenException('user illegal');
    }
    const payload = { uid: user.uid, level: user.level };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
