const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  try {
    console.log('Connecting to:', process.env.DATABASE_URL);
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    const [rows] = await conn.execute('SELECT COUNT(*) as count FROM products');
    console.log('Products count:', rows[0].count);
    await conn.end();
  } catch (e) {
    console.error('Connection error:', e.message);
  }
}
test();
