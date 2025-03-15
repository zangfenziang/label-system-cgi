import { Controller, Post } from '@nestjs/common';

@Controller('cgi')
export class AuthController {
  @Post('login')
  login(): string {
    return 'This action returns all cats';
  }
}
