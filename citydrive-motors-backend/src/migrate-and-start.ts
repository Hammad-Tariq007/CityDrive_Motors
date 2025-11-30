import { DataSource } from 'typeorm';
import { typeormConfig } from './config/typeorm.config';

const dataSource = new DataSource(typeormConfig as any);

dataSource
  .initialize()
  .then(async () => {
    console.log('Running migrations...');
    await dataSource.runMigrations();
    console.log('All migrations completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
