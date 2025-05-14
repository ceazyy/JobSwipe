import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create pool with connection timeout and retry logic
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20
});

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Add connection retry logic
async function connectWithRetry(retries = MAX_RETRIES): Promise<void> {
  try {
    const client = await pool.connect();
    client.release();
    console.log('Successfully connected to database');
  } catch (error) {
    if (retries > 0) {
      console.log(`Failed to connect to database. Retrying in ${RETRY_DELAY/1000} seconds... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries - 1);
    }
    console.error('Failed to connect to database after multiple retries:', error);
    throw error;
  }
}

// Initialize connection
connectWithRetry().catch(error => {
  console.error('Fatal database connection error:', error);
  process.exit(1);
});

export const db = drizzle(pool, { schema });