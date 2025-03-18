import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';
import { IRequest } from 'src/type';

@Controller('cgi')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign')
  async sign(@Body() body) {
    return await this.authService.signIn(body.username, body.password);
  }

  @Public()
  @Get('loginsession')
  async loginsession(@Request() req: IRequest) {
    return { code: req.user.uid ? 0 : 1 };
  }
}
