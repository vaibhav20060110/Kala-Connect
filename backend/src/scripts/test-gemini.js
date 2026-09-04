import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

console.log('========================================================');
console.log('  KalaConnect Google Gemini API Connection Tester');
console.log('========================================================\n');

if (!apiKey || apiKey.trim() === '') {
  console.log('⚠️  Neither GEMINI_API_KEY nor GOOGLE_API_KEY is set in backend/.env');
  console.log('ℹ️  KalaConnect is running with built-in intelligent fallback simulation.\n');
  console.log('To connect Google Gemini API:');
  console.log('1. Get a FREE API key from Google AI Studio:');
  console.log('   👉 https://aistudio.google.com/');
  console.log('2. Open backend/.env');
  console.log('3. Set your key:');
  console.log('   GEMINI_API_KEY=AIzaSy...');
  console.log('\n========================================================');
  process.exit(0);
}

const maskedKey = `${apiKey.trim().slice(0, 6)}...${apiKey.trim().slice(-4)}`;
console.log(`🔑 Detected API Key: ${maskedKey}`);
console.log(`🤖 Testing Model:    ${modelName}`);
console.log('📡 Sending test ping to Google Gemini API...\n');

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = 'Respond in one short sentence confirming that the KalaConnect AI Virtual Business Manager connection is live and active.';
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    console.log('✅ Google Gemini API Connection: SUCCESSFUL!');
    console.log(`💬 Gemini Live Response:\n   "${responseText}"\n`);
    console.log('🎉 Google Generative AI is ready for Multimodal Vision, Voice Cataloging, and Dynamic Pricing!');
  } catch (err) {
    console.error('❌ Google Gemini API Call Failed:');
    console.error(`   Error message: ${err.message}`);
    console.log('\nTroubleshooting Tips:');
    console.log('1. Verify that your API key is active and has no extra spaces.');
    console.log('2. Check if Generative Language API is enabled in your Google Cloud / AI Studio project.');
    console.log('3. Ensure your internet connection has access to generativelanguage.googleapis.com.');
    process.exit(1);
  } finally {
    console.log('========================================================');
  }
}

testGemini();
