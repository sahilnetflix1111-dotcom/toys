import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import pool from '../../../lib/db';

export async function GET() {
  const envVar = process.env.DATABASE_URL;
  let rawConnectionError = null;
  let poolError = null;
  let rawCount = 0;
  let poolCount = 0;

  // Test 1: Direct connection using mysql2/promise (bypassing pool)
  try {
    if (envVar) {
      const conn = await mysql.createConnection(envVar);
      const [rows] = await conn.execute('SELECT COUNT(*) as c FROM Product');
      rawCount = (rows as any)[0].c;
      await conn.end();
    }
  } catch (err: any) {
    rawConnectionError = err.message + ' | Code: ' + err.code;
  }

  // Test 2: Using the shared pool
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as c FROM Product');
    poolCount = (rows as any)[0].c;
  } catch (err: any) {
    poolError = err.message + ' | Code: ' + err.code;
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    databaseUrlSet: !!envVar,
    databaseUrlMasked: envVar ? envVar.replace(/:[^:@]+@/, ':***@') : null,
    tests: {
      rawConnection: {
        success: rawConnectionError === null,
        count: rawCount,
        error: rawConnectionError
      },
      poolConnection: {
        success: poolError === null,
        count: poolCount,
        error: poolError
      }
    }
  });
}
