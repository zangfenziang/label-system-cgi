import { All, Controller, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

@Controller()
export class MainController {
  @All('/*')
  redirect() {
    return new StreamableFile(
      createReadStream('../label-system/dist/index.html'),
    );
  }
}
