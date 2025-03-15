import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.model';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { AuthController } from './auth.controller';
import * as config from 'config';
import { AuthService } from './auth.service';
import { UsersService } from './user.service';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: config.get('jwtToken'),
      signOptions: { expiresIn: '16h' },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    AuthService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class UserModule {}
