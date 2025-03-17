import { All, Controller, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { Public } from './user/auth.guard';

@Controller()
export class MainController {
  @Public()
  @All('/*')
  redirect() {
    return new StreamableFile(
      createReadStream('../label-system/dist/index.html'),
    );
  }
}
