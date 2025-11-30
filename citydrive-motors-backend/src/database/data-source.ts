import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Car } from './entities/car.entity';
import { Remark } from './entities/remark.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'citydrive',
  password: process.env.DB_PASS || 'citydrive123',
  database: process.env.DB_NAME || 'citydrive_db',
  entities: [User, Car, Remark],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
});
