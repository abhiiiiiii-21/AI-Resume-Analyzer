import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Drizzle Kit Configuration
 * 
 * This file tells drizzle-kit where to find schema files and
 * where to output migration SQL files. Used by:
 *   - `npm run db:generate` → creates migration files
 *   - `npm run db:studio`   → opens Drizzle Studio GUI
 */
export default defineConfig({
    // Where our Drizzle schema definitions live
    schema: './src/db/schema/*',

    // Where generated migration SQL files go
    out: './drizzle',

    // We're using Neon Postgres
    dialect: 'postgresql',

    // Database connection — loaded from .env
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
