import dataSource from './data-source';

async function runMigrations() {
  await dataSource.initialize();
  try {
    await dataSource.runMigrations();
    console.log('Migrations executed successfully');
  } finally {
    await dataSource.destroy();
  }
}

runMigrations().catch((error) => {
  console.error('Failed to run migrations', error);
  process.exit(1);
});
