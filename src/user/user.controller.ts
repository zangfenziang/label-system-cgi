import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { User, UserLevel, UserStatus } from 'src/entity/user.model';
import { Auth, Public } from './auth.guard';
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

  @Public()
  @Put('user')
  insert(@Body() body: User, @Request() req: IRequest) {
    if (req?.user?.level !== UserLevel.Admin) {
      body.level = UserLevel.Normal;
    }
    return this.userService.insert(body);
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

  @Auth(UserLevel.Admin)
  @Delete('user/:id')
  async del(@Param('id') id: string) {
    return this.userService.del(+id);
  }

  @Auth(UserLevel.Admin)
  @Get('user/:id')
  async get(@Param('id') id: string) {
    return this.userService.findOne({
      uid: +id,
    });
  }

  @Auth(UserLevel.Admin)
  @Get('user/:id/cost')
  async getCost(@Param('id') id: string, @Body() body) {
    return await this.userService.getUserCost(Number(id), body);
  }
}
