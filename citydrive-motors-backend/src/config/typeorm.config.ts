import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const isProduction = process.env.NODE_ENV === 'production';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,

  entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],

  // DO NOT use synchronize in production
  synchronize: !isProduction,
  logging: !isProduction,

  ssl: isProduction ? { rejectUnauthorized: false } : false,
  extra: isProduction ? { ssl: { rejectUnauthorized: false } } : {},
};
