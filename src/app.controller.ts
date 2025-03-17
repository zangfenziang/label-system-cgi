import { All, Controller, Request } from '@nestjs/common';
import { Public } from './user/auth.guard';
import { IRequest } from './type';

@Controller()
export class AppController {
  @Public()
  @All()
  html(@Request() req: IRequest) {
    console.log(req.path);
  }
}
