import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const isProduction = process.env.NODE_ENV === 'production';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',

  url: process.env.DATABASE_URL || undefined,

  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'citydrive',
  password: process.env.DB_PASS || 'citydrive123',
  database: process.env.DB_NAME || 'citydrive_db',

  entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],
  synchronize: !isProduction,
  logging: !isProduction,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};
