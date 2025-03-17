import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.model';
import { Task } from './entity/task.model';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { MainController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/label-system.db',
      entities: [User, Task],
      synchronize: true,
    }),
    UserModule,
    TaskModule,
  ],
  controllers: [MainController],
  providers: [],
})
export class AppModule {}
