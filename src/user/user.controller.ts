import { Controller, Get, Post, Request } from '@nestjs/common';
import { UserLevel } from 'src/entity/user.model';
import { Auth } from './auth.guard';
import { UserService } from './user.service';
import { IRequest } from 'src/type';

@Controller('cgi')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Auth(UserLevel.Admin)
  @Get('user')
  findAll() {
    return this.userService.findAll();
  }

  @Get('user/me')
  me(@Request() req: IRequest) {
    return this.userService.findOne({
      uid: req.user.uid,
    });
  }

  @Post('user/:id')
  update() {
    return 'This action returns all cats';
  }
}
