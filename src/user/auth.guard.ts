import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as config from 'config';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserLevel } from 'src/entity/user.model';

const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
const Auth_Level_KEY = 'auth';
export const Auth = (level: UserLevel) => SetMetadata(Auth_Level_KEY, level);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.get('jwtToken'),
      });

      const level = this.reflector.getAllAndOverride<UserLevel>(
        Auth_Level_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (payload.level < level) {
        throw new UnauthorizedException();
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
