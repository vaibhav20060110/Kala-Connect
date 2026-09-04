import dotenv from 'dotenv';
import app from './app.js';
import { initDatabase } from './db/index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('========================================================');
    console.log('  KalaConnect (हस्तशिल्प व्यापार साथी) - Backend API');
    console.log('========================================================');

    await initDatabase();

    app.listen(PORT, () => {
      console.log(`[SERVER] 🚀 Backend running smoothly on http://localhost:${PORT}`);
      console.log(`[SERVER] 📱 Interactive Mobile Demo available at: http://localhost:${PORT}/demo`);
      console.log(`[SERVER] 📦 Health Check at: http://localhost:${PORT}/health`);
      console.log(`[SERVER] 🤖 Gemini AI Service Status: Ready`);
      console.log('========================================================');
    });
  } catch (err) {
    console.error('[FATAL] Failed to start KalaConnect backend:', err);
    process.exit(1);
  }
}

startServer();
