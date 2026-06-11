import pkg from 'pg';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const { Client } = pkg;

async function seedUsers() {
  const dbClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME || 'isp_dashboard',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await dbClient.connect();
    console.log('Connected to database.\n');

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
        console.log(`✅ User created: ${u.username} / ${u.password} (${u.role})`);
      } else {
        console.log(`⏭️  User '${u.username}' already exists, skipped.`);
      }
    }

    console.log('\nDone! All users are ready.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await dbClient.end();
  }
}

seedUsers();
