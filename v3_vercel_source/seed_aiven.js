const mysql = require('mysql2/promise');
const fs = require('fs');

async function seed() {
  const uri = 'mysql://avnadmin:AVNS_gCPWRmBAhlEFxP3r4gM@os-1e659c35-sahilnetflix1111-68b2.b.aivencloud.com:21735/defaultdb';
  console.log("Connecting...");
  const conn = await mysql.createConnection({
    uri,
    multipleStatements: true,
    ssl: { rejectUnauthorized: false }
  });
  console.log("Connected! Running database_setup_mysql.sql...");
  const setupSql = fs.readFileSync('database_setup_mysql.sql', 'utf8');
  await conn.query(setupSql);

  console.log("Running seed_products.sql...");
  const seedSql = fs.readFileSync('seed_products.sql', 'utf8');
  await conn.query(seedSql);

  console.log("Database seeded successfully!");
  
  const [rows] = await conn.query('SELECT COUNT(*) as c FROM Product');
  console.log("Total Products:", rows[0].c);
  
  await conn.end();
}
seed().catch(console.error);
