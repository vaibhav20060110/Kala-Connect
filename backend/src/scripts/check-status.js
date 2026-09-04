import dotenv from 'dotenv';
import { getDbStatus, initDatabase, closeDatabase } from '../db/index.js';
import { getAiStatus } from '../services/geminiService.js';

dotenv.config();

console.log('========================================================');
console.log('  kalaSetu System Integration Health Check');
console.log('========================================================\n');

async function runCheck() {
  await initDatabase();

  const db = getDbStatus();
  const ai = getAiStatus();

  console.log('🐘 PostgreSQL Database:');
  console.log(`   Configured: ${db.configured ? 'YES' : 'NO'}`);
  console.log(`   Mode:       ${db.mode}`);
  if (db.databaseUrlMasked) {
    console.log(`   Endpoint:   ${db.databaseUrlMasked}`);
  }

  console.log('\n🤖 Google Gemini API:');
  console.log(`   Configured: ${ai.configured ? 'YES' : 'NO'}`);
  console.log(`   Status:     ${ai.status}`);
  console.log(`   Model:      ${ai.model}`);
  if (ai.keyMasked) {
    console.log(`   Key:        ${ai.keyMasked}`);
  }

  console.log('\n========================================================');
  await closeDatabase();
}

runCheck();
