const { DataSource } = require('typeorm');
const { typeormConfig } = require('./dist/config/typeorm.config');

const dataSource = new DataSource(typeormConfig);

dataSource
  .initialize()
  .then(async () => {
    console.log('🚀 Running database migrations...');
    await dataSource.runMigrations();
    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
