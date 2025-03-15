import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
  Waiting = 'waiting',
  Lock = 'lock',
  Audit = 'audit',
  Accept = 'accept',
  Reject = 'reject',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  taskId: number;

  @Column()
  uid: number;

  @Column()
  taskStatus: TaskStatus;

  @Column({
    type: 'json',
  })
  info: {};

  @Column({
    type: 'json',
  })
  labelInfo: {};
}
