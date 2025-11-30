// backend/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const isProduction = process.env.NODE_ENV === 'production';

const config: TypeOrmModuleOptions = {
  type: 'postgres',

  // If DATABASE_URL exists → use it (Railway, Render, etc.)
  // Otherwise fall back to local values
  url: process.env.DATABASE_URL || undefined,

  // Local fallback (only used when DATABASE_URL is not set)
  host: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_HOST || 'localhost',
  port: process.env.DATABASE_URL
    ? undefined
    : Number(process.env.DB_PORT) || 5432,
  username: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_USER || 'citydrive',
  password: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_PASSWORD || 'citydrive123',
  database: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_NAME || 'citydrive_db',

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: !isProduction, // true locally, false in production
  logging: !isProduction,

  // This fixes the password error when using DATABASE_URL
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,

  extra: isProduction
    ? {
        ssl: { rejectUnauthorized: false },
      }
    : undefined,
};

export const typeormConfig = config;
