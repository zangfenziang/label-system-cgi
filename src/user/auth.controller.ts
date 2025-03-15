import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';

@Controller('cgi')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign')
  async sign(@Body() body) {
    return await this.authService.signIn(body.username, body.password);
  }
}
