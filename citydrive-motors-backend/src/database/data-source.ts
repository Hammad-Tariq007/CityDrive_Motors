import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Car } from './entities/car.entity';
import { Remark } from './entities/remark.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Car, Remark],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
});

module.exports = AppDataSource;
