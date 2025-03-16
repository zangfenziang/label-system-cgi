import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.model';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { AuthController } from './auth.controller';
import * as config from 'config';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { Task } from 'src/entity/task.model';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task]),
    JwtModule.register({
      global: true,
      secret: config.get('jwtToken'),
      signOptions: { expiresIn: '16h' },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    AuthService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class UserModule {
  constructor(private readonly userService: UserService) {
    this.userService.check();
  }
}
