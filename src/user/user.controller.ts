import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { User, UserLevel, UserStatus } from 'src/entity/user.model';
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

  @Post('user/me')
  async updateSelf(@Request() req: IRequest, @Body() body: User) {
    const user = await this.userService.findOne({
      uid: req.user.uid,
    });
    if (!user || user.status !== UserStatus.Active) {
      throw new ForbiddenException('user status illegal');
    }
    if (body.level) {
      throw new ForbiddenException('level illegal');
    }
    return await this.userService.updateInfo(user.uid, body);
  }

  @Auth(UserLevel.Admin)
  @Post('user/:id')
  async update(@Param('id') id: string, @Body() body: User) {
    return await this.userService.updateInfo(Number(id), body);
  }
}
