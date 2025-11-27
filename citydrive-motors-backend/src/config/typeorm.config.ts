// src/config/typeorm.config.ts — ULTIMATE VERSION (LOCAL + RAILWAY)
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const isProduction = process.env.NODE_ENV === 'production';

// RAILWAY: DATABASE_URL exists → use it
// LOCAL: DATABASE_URL not exist → use localhost values
export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',

  // PRIORITY 1: Railway's DATABASE_URL
  url: process.env.DATABASE_URL || undefined,

  // PRIORITY 2: Local Docker values (only used when DATABASE_URL is missing)
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'citydrive',
  password: process.env.DB_PASS || 'citydrive123',
  database: process.env.DB_NAME || 'citydrive_db',

  entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],
  synchronize: !isProduction, // true locally, false on Railway
  logging: !isProduction, // true locally, false on Railway

  // Railway needs SSL, local doesn't
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  extra: isProduction ? { ssl: true } : {},
};
