import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //配置cors
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
