import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, // ← ADD THIS IMPORT
} from 'typeorm';
import { Car } from './car.entity'; // ← ADD THIS IMPORT
import { Remark } from './remark.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phone?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ← THIS IS THE MISSING REVERSE RELATION
  @OneToMany(() => Car, (car) => car.owner)
  cars?: Car[];

  @OneToMany(() => Remark, (remark) => remark.user)
  remarks?: Remark[];
}
