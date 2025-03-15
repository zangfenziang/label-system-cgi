import { Request } from 'express';
import { UserLevel } from './entity/user.model';

export type IRequest = Request & {
  user: {
    uid: number;
    level: UserLevel;
  };
};
