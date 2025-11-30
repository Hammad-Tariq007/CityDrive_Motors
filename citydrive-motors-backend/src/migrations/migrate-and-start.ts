import { DataSource } from 'typeorm';
import { typeormConfig } from '../config/typeorm.config';

const dataSource = new DataSource(typeormConfig as any);

dataSource
  .initialize()
  .then(async () => {
    console.log('DataSource initialized – running migrations...');
    await dataSource.runMigrations({ transaction: 'all' });
    console.log('Migrations completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
