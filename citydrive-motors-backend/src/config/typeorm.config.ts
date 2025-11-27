// src/config/typeorm.config.ts — FINAL 100% WORKING VERSION
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',

  // THIS LINE IS THE ONLY ONE THAT MATTERS ON RAILWAY
  url: process.env.DATABASE_URL,

  // DELETE ALL THESE LINES — THEY ARE CAUSING THE ERROR
  // host: 'localhost',
  // port: 5432,
  // username: 'citydrive',
  // password: 'citydrive123',
  // database: 'citydrive_db',

  entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
  ssl: { rejectUnauthorized: false }, // Railway requires SSL
};
