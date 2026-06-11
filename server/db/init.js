import pkg from 'pg';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const { Client } = pkg;

async function initDatabase() {
  const dbName = process.env.DB_NAME || 'isp_dashboard';

  // Step 1: Connect to default postgres DB to create our database
  console.log('Connecting to PostgreSQL...');
  const adminClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await adminClient.connect();
    const dbCheck = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (dbCheck.rowCount === 0) {
      console.log(`Creating database "${dbName}"...`);
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log('Database created.');
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  // Step 2: Connect to our database and run schema + seed
  console.log('Connecting to isp_dashboard...');
  const dbClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: dbName,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await dbClient.connect();

    // Run schema
    console.log('Running schema.sql...');
    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    await dbClient.query(schemaSQL);
    console.log('Schema applied.');

    // Run seed
    console.log('Running seed.sql...');
    const seedSQL = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
    await dbClient.query(seedSQL);
    console.log('Seed data inserted.');

    // Insert users with different roles
    const users = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'operator', password: 'operator123', role: 'operator' },
      { username: 'finance', password: 'finance123', role: 'finance' },
      { username: 'teknisi', password: 'teknisi123', role: 'technician' },
    ];

    for (const u of users) {
      const existing = await dbClient.query(
        'SELECT id FROM users WHERE username = $1', [u.username]
      );
      if (existing.rowCount === 0) {
        const hash = await bcrypt.hash(u.password, 10);
        await dbClient.query(
          "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)",
          [u.username, hash, u.role]
        );
        console.log(`User created: ${u.username} / ${u.password} (${u.role})`);
      } else {
        console.log(`User '${u.username}' already exists.`);
      }
    }

    console.log('\nDatabase initialization complete!');
  } catch (err) {
    console.error('Error during initialization:', err.message);
    process.exit(1);
  } finally {
    await dbClient.end();
  }
}

initDatabase();
