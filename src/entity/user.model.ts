import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserLevel {
  Admin = 'admin',
  Normal = 'normal',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  level: UserLevel;
}
