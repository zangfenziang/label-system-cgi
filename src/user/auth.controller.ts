import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('cgi')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign')
  async sign(@Body() body) {
    return await this.authService.signIn(body.username, body.password);
  }
}
