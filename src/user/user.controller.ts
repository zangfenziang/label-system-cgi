import { Controller, Get, Post } from '@nestjs/common';

@Controller('cgi')
export class UserController {
  @Get('user')
  findAll(): string {
    return 'This action returns all cats';
  }

  @Get('user/:id')
  find(): string {
    return 'This action returns all cats';
  }

  @Post('user/:id')
  update(): string {
    return 'This action returns all cats';
  }
}
