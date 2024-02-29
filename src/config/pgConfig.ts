import { Pool } from 'pg';


// Create a new pool instance, which will manage multiple client connections to the PostgreSQL server.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Connection string from environment variable
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // For Heroku or other cloud providers, if needed
});

export default pool;
