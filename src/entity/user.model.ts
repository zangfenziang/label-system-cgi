import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum UserLevel {
  Admin = 9999,
  Normal = 1,
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export const filterSensitive = (user: User) => {
  delete user.password;
  delete user.salt;
  return user;
};

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  level: UserLevel;

  @Column()
  status: UserStatus;
}
