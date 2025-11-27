import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const isProduction = process.env.NODE_ENV === 'production';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || undefined,
  host: process.env.DATABASE_URL ? undefined : 'localhost',
  port: process.env.DATABASE_URL ? undefined : 5432,
  username: process.env.DATABASE_URL ? undefined : 'citydrive',
  password: process.env.DATABASE_URL ? undefined : 'citydrive123',
  database: process.env.DATABASE_URL ? undefined : 'citydrive_db',
  entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],
  synchronize: !isProduction,
  logging: !isProduction,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};
