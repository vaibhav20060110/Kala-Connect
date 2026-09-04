import dotenv from 'dotenv';
import pg from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;

console.log('========================================================');
console.log('  kalaSetu PostgreSQL Database Connection Tester');
console.log('========================================================\n');

if (!databaseUrl || databaseUrl.trim() === '') {
  console.log('⚠️  DATABASE_URL is not set in backend/.env');
  console.log('ℹ️  kalaSetu is currently using the zero-config local in-memory store.');
  console.log('\nTo connect PostgreSQL:');
  console.log('1. Open backend/.env');
  console.log('2. Set DATABASE_URL to your PostgreSQL connection string:');
  console.log('   - Neon (Cloud, Free):     postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require');
  console.log('   - Supabase (Cloud, Free): postgresql://postgres:pass@db.xyz.supabase.co:5432/postgres');
  console.log('   - Local PostgreSQL:       postgresql://postgres:password@localhost:5432/kalasetu');
  console.log('\n========================================================');
  process.exit(0);
}

const isNeon = databaseUrl.includes('neon.tech');
const isLocal = databaseUrl.includes('localhost') ||
                databaseUrl.includes('127.0.0.1') ||
                databaseUrl.includes('host.docker.internal');

const maskedUrl = databaseUrl.replace(/:[^:@]+@/, ':****@');
console.log(`📡 Connecting to: ${maskedUrl}`);
if (isNeon) {
  console.log('🔒 Driver: Neon Serverless WebSocket (Port 443 - Firewall resistant)\n');
} else {
  console.log(`🔒 SSL Mode: ${isLocal ? 'Disabled (Localhost)' : 'Enabled (Cloud rejectUnauthorized: false)'}\n`);
}

const pool = isNeon
  ? new NeonPool({ connectionString: databaseUrl })
  : new pg.Pool({
      connectionString: databaseUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000
    });

async function runTest() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ PostgreSQL Connection: SUCCESSFUL!');

    // Test query
    const timeRes = await client.query('SELECT NOW() as current_time, version()');
    console.log(`⏱️  Database Time:   ${timeRes.rows[0].current_time}`);
    console.log(`🏷️  Server Version:  ${timeRes.rows[0].version.split(',')[0]}`);

    // Check tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    const tables = tablesRes.rows.map(r => r.table_name);
    console.log(`\n📋 Detected Tables (${tables.length}): ${tables.join(', ') || 'None found yet (will be created on backend startup)'}`);

    if (tables.includes('comparables')) {
      const compCount = await client.query('SELECT count(*) FROM comparables');
      console.log(`📊 Handicraft Comparables: ${compCount.rows[0].count} benchmark items`);
    }
    if (tables.includes('products')) {
      const prodCount = await client.query('SELECT count(*) FROM products');
      console.log(`📦 Artisan Products:       ${prodCount.rows[0].count} items`);
    }

    console.log('\n🎉 kalaSetu is ready to use PostgreSQL as its primary database!');
  } catch (err) {
    console.error('\n❌ PostgreSQL Connection Failed:');
    console.error(`   Error message: ${err.message}`);
    console.log('\nTroubleshooting Tips:');
    console.log('1. Verify your username and password in DATABASE_URL.');
    console.log('2. If using Supabase / Neon / Render, ensure the database is active (not paused).');
    console.log('3. If using local PostgreSQL, check if the PostgreSQL service is running on port 5432.');
    console.log('4. Ensure the database name exists on your PostgreSQL server.');
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
    console.log('========================================================');
  }
}

runTest();
