import pkg from 'pg';  // Default import
const { Pool } = pkg;  // Destructure to get the Pool class

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error', err);
  process.exit(-1);
});

export default pool;
