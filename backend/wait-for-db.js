const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'todolist',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function waitForDB(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await pool.connect();
      console.log('✅ Base de données prête !');
      client.release();
      await pool.end();
      return true;
    } catch (err) {
      console.log(`⏳ Attente de la base de données... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  console.error('❌ Timeout: La base de données n\'est pas disponible');
  process.exit(1);
}

waitForDB(); 