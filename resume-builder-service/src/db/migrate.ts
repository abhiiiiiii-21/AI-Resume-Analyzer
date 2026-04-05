import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { db, pool } from '../config/db';

/**
 * Migration Runner
 * 
 * Runs all pending Drizzle migrations against the database.
 * 
 * Usage:
 *   npm run db:migrate
 * 
 * Workflow:
 *   1. Define/update schema files in src/db/schema/
 *   2. Run `npm run db:generate` to create SQL migration files
 *   3. Run `npm run db:migrate` to apply them to the database
 * 
 * The migrations folder is ./drizzle (at project root).
 */
async function runMigrations() {
    console.log('🔄 Running database migrations...');

    try {
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('✅ Migrations completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        // Close the connection pool when done
        await pool.end();
    }
}

runMigrations();
