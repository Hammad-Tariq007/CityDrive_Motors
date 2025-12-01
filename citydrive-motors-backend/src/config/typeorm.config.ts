import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const isProduction = process.env.NODE_ENV === 'production';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || undefined,

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
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: !isProduction,
  logging: !isProduction,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,

  extra: isProduction
    ? {
        ssl: { rejectUnauthorized: false },
      }
    : undefined,
};

export const typeormConfig = config;
