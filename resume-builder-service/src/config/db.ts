import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { env } from './env';
import * as schema from '../db/schema/index';

/**
 * Database Client Configuration
 * 
 * Creates a Drizzle ORM instance connected to Neon Postgres.
 * 
 * Why Neon serverless driver?
 * - Neon uses WebSocket-based connections which work great with
 *   serverless/edge environments and also work fine in Node.js.
 * - The @neondatabase/serverless package handles connection pooling.
 * 
 * The schema is passed to drizzle() so we get full type-safe queries
 * (e.g., db.query.users.findMany()).
 */

// Create a connection pool to Neon Postgres
const pool = new Pool({ connectionString: env.databaseUrl });

// Create the Drizzle ORM instance with our schema for type-safe queries
export const db = drizzle(pool, { schema });

// Export the pool too in case we need raw connections (e.g., for migrations)
export { pool };
