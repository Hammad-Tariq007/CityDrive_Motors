import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Remark } from './remark.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column('int')
  year: number;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column('int')
  mileage: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('json', { default: [] })
  images: string[];

  @Column({ default: false })
  isSold: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relation: Many cars belong to one user
  @ManyToOne(() => User, (user) => user.cars, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'ownerId' }) // ← This forces the column name exactly as "ownerId"
  owner?: User;

  @OneToMany(() => Remark, (remark) => remark.car)
  remarks?: Remark[];
  // We no longer need @RelationId — TypeORM automatically exposes ownerId from the relation
  // You can still use car.ownerId in code — it works perfectly!
}
