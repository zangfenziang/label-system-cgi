import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum UserLevel {
  Admin = 'admin',
  Normal = 'normal',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

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
