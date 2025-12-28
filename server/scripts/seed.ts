import { initializeDb } from '../datastore';
import { seedDatabase } from '../datastore/seed';

(async () => {
  try {
    console.log('Initializing database...');
    await initializeDb();
    
    console.log('\nSeeding database with sample data...');
    await seedDatabase();
    
    console.log('\n✅ All done! You can now start the server.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
