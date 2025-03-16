import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

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
  title: string;

  @Column()
  desc: string;

  @Column()
  cost: number;

  @Index()
  @Column({
    default: '',
  })
  uid: number;

  @Column()
  taskStatus: TaskStatus;

  @Column({
    type: 'json',
  })
  info: {
    files: {
      name: string;
      id: string;
    }[];
  };

  @Column({
    type: 'json',
  })
  labelInfo: {
    files: {
      name: string;
      id: string;
    }[];
  };

  @Index()
  @Column()
  finishTime: Date;
}
