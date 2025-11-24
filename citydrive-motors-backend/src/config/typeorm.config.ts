import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'citydrive',
  password: 'citydrive123',
  database: 'citydrive_db',
  entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};
