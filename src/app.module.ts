import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.model';
import { Task } from './entity/task.model';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/label-system.db',
      entities: [User, Task],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
