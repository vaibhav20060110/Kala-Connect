import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const items = [
  { key: 'sample_terracotta_pot', title: 'Terracotta Clay Pot' },
  { key: 'sample_clay_items', title: 'Clay Kulhad & Tableware' },
  { key: 'sample_grass_mat', title: 'Handwoven River Grass Mat' },
  { key: 'sample_cottage_basket', title: 'Cottage Sabai Cane Basket' }
];

for (const item of items) {
  const jpgPath = path.join(uploadsDir, item.key + '.jpg');
  if (fs.existsSync(jpgPath)) {
    const b64 = fs.readFileSync(jpgPath).toString('base64');
    
    // Raw workshop version (authentic uncalibrated lighting, workshop tint)
    const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="workshopWall" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2D9D0"/>
      <stop offset="100%" stop-color="#C7B8A8"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#workshopWall)"/>
  <image href="data:image/jpeg;base64,${b64}" x="40" y="40" width="720" height="720" preserveAspectRatio="xMidYMid meet" opacity="0.94"/>
  <rect x="24" y="24" width="140" height="32" rx="6" fill="#1E293B" opacity="0.75"/>
  <text x="94" y="45" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">📷 RAW PHOTO</text>
</svg>`;

    // Studio Enhanced version (clean pure gradient, floating pedestal shadow, studio clarity)
    const enhancedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="studioLight" cx="50%" cy="42%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="65%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </radialGradient>
    <filter id="studioShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#0F172A" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="800" height="800" fill="url(#studioLight)"/>
  <ellipse cx="400" cy="710" rx="260" ry="26" fill="#0F172A" opacity="0.14"/>
  <g filter="url(#studioShadow)">
    <image href="data:image/jpeg;base64,${b64}" x="60" y="60" width="680" height="680" preserveAspectRatio="xMidYMid meet"/>
  </g>
  <rect x="570" y="24" width="206" height="34" rx="17" fill="#0F172A" opacity="0.88"/>
  <text x="673" y="46" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">✨ AI STUDIO READY</text>
</svg>`;

    fs.writeFileSync(path.join(uploadsDir, item.key + '_raw.svg'), rawSvg);
    fs.writeFileSync(path.join(uploadsDir, item.key + '_enhanced.svg'), enhancedSvg);
    console.log('✅ Generated raw & enhanced SVGs for:', item.key);
  } else {
    console.warn('⚠️ File not found:', jpgPath);
  }
}
