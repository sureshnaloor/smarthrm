import pkg from 'pg';
const { Pool } = pkg;
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set in .env file');
  process.exit(1);
}

// Modify the connection string to use postgres database
const connectionString = process.env.DATABASE_URL.replace('/smarthrm', '/postgres');

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(process.cwd(), 'rds-ca-2019-root.pem')).toString(),
  },
});

async function createDatabase() {
  try {
    console.log('Attempting to connect to postgres database...');
    console.log('Connection string:', connectionString);
    
    // Connect to postgres database
    const client = await pool.connect();
    
    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'smarthrm'"
    );
    
    if (result.rows.length === 0) {
      // Create the database if it doesn't exist
      await client.query('CREATE DATABASE smarthrm');
      console.log('Database created successfully');
    } else {
      console.log('Database already exists');
    }
    
    client.release();
  } catch (error) {
    console.error('Error creating database:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  } finally {
    await pool.end();
  }
}

createDatabase(); 