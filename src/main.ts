import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //配置cors
  app.enableCors();
  app.useBodyParser('json', { limit: '10mb' });

  await app.listen(3000);
}
bootstrap();
