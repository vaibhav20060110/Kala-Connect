import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function createCraftSvg({ title, subtitle, tag, isEnhanced, primaryColor, secondaryColor, iconType }) {
  const bgGrad = isEnhanced
    ? `<radialGradient id="bg" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="60%" stop-color="#F7FAFC" />
        <stop offset="100%" stop-color="#EDF2F7" />
       </radialGradient>`
    : `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E2E8F0" />
        <stop offset="50%" stop-color="#CBD5E0" />
        <stop offset="100%" stop-color="#A0AEC0" />
       </linearGradient>`;

  const badge = isEnhanced
    ? `<rect x="20" y="20" width="170" height="36" rx="18" fill="#2B6CB0" fill-opacity="0.9" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
       <text x="36" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">✨ AI STUDIO ENHANCED</text>`
    : `<rect x="20" y="20" width="130" height="36" rx="18" fill="#4A5568" fill-opacity="0.8" />
       <text x="36" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">📷 RAW CAPTURE</text>`;

  let graphic = '';
  if (iconType === 'textile') {
    graphic = `
      <g transform="translate(250, 220)">
        <path d="M-130,-100 C-60,-130 60,-70 130,-100 C140,-20 120,60 130,120 C60,90 -60,140 -130,110 C-140,30 -120,-30 -130,-100 Z"
              fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="5" />
        <path d="M-100,-70 C-40,-100 40,-40 100,-70 M-90,-20 C-30,-50 50,10 90,-20 M-100,30 C-40,0 40,60 100,30 M-90,80 C-30,50 50,110 90,80"
              stroke="${secondaryColor}" stroke-width="3" stroke-dasharray="8,6" fill="none" />
        <circle cx="0" cy="0" r="45" fill="${secondaryColor}" fill-opacity="0.3" stroke="${secondaryColor}" stroke-width="3" />
        <path d="M0,-35 L10,-10 L35,0 L10,10 L0,35 L-10,10 L-35,0 L-10,-10 Z" fill="${secondaryColor}" />
      </g>`;
  } else if (iconType === 'pottery') {
    graphic = `
      <g transform="translate(250, 230)">
        <!-- Pedestal / Shadow -->
        <ellipse cx="0" cy="140" rx="90" ry="16" fill="${isEnhanced ? '#CBD5E0' : '#718096'}" fill-opacity="0.5" />
        <!-- Vase Body -->
        <path d="M-30,-130 L30,-130 L24,-100 C60,-60 100,-10 90,60 C80,120 40,135 35,140 L-35,140 C-40,135 -80,120 -90,60 C-100,-10 -60,-60 -24,-100 Z"
              fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="4" />
        <!-- Persian floral motifs -->
        <circle cx="0" cy="20" r="30" fill="none" stroke="${secondaryColor}" stroke-width="4" />
        <path d="M0,-10 C15,-10 20,5 0,20 C-20,5 -15,-10 0,-10 Z" fill="${secondaryColor}" />
        <path d="M0,50 C15,50 20,35 0,20 C-20,35 -15,50 0,50 Z" fill="${secondaryColor}" />
        <path d="M-30,20 C-30,5 -15,0 0,20 C-15,40 -30,35 -30,20 Z" fill="${secondaryColor}" />
        <path d="M30,20 C30,5 15,0 0,20 C15,40 30,35 30,20 Z" fill="${secondaryColor}" />
      </g>`;
  } else if (iconType === 'painting_madhubani') {
    graphic = `
      <g transform="translate(250, 220)">
        <!-- Canvas board with double line border -->
        <rect x="-140" y="-120" width="280" height="240" rx="4" fill="#FDF8ED" stroke="#3D2314" stroke-width="6" />
        <rect x="-132" y="-112" width="264" height="224" fill="none" stroke="#C05621" stroke-width="2" stroke-dasharray="4,4" />
        
        <!-- Mithila Tree of Life Trunk & Foliage -->
        <path d="M-15,100 C-10,30 -40,-20 -5, -60 C30,-20 10,30 15,100 Z" fill="#744210" />
        <circle cx="-50" cy="-60" r="35" fill="#276749" fill-opacity="0.85" />
        <circle cx="40" cy="-60" r="35" fill="#276749" fill-opacity="0.85" />
        <circle cx="-5" cy="-85" r="40" fill="#2F855A" fill-opacity="0.9" />
        <circle cx="-5" cy="-60" r="24" fill="#D69E2E" />

        <!-- Madhubani Sun / Flower Motif -->
        <circle cx="-5" cy="-60" r="14" fill="#C53030" />
        
        <!-- Traditional Madhubani Fish (Matsya) Motif -->
        <path d="M-80,40 C-50,20 -30,60 0,40 C-30,20 -50,60 -80,40 Z" fill="#C53030" stroke="#742A2A" stroke-width="2" />
        <polygon points="-80,40 -100,25 -95,40 -100,55" fill="#C53030" />
        <circle cx="-40" cy="38" r="3" fill="#FFFFFF" />

        <!-- Peacock bird motif -->
        <path d="M40,20 C60,0 80,10 75,35 C70,55 50,55 40,40 Z" fill="#2B6CB0" />
        <circle cx="70" cy="18" r="7" fill="#2B6CB0" />
        <path d="M75,18 L88,14 L77,22 Z" fill="#DD6B20" />
        <!-- Crest feather -->
        <path d="M68,12 Q64,0 72,2" stroke="#2B6CB0" stroke-width="2" fill="none" />
      </g>`;
  } else if (iconType === 'painting_warli') {
    graphic = `
      <g transform="translate(250, 220)">
        <!-- Mud-cloth Canvas -->
        <rect x="-140" y="-120" width="280" height="240" rx="3" fill="#7B341E" stroke="#521B0B" stroke-width="5" />
        
        <!-- Central Spiral Dance (Tarpa Dance) in White Rice Paste -->
        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
        <!-- Inner dancers ring -->
        <g stroke="#FFFFFF" stroke-width="2" fill="#FFFFFF">
          <!-- Tarpa Player in Center -->
          <circle cx="0" cy="0" r="5" />
          <polygon points="0,5 -5,22 5,22" />
          <polygon points="0,22 -6,35 6,35" />
          <line x1="0" y1="12" x2="16" y2="2" />
          
          <!-- Outer Circle Dancers -->
          <g transform="translate(-40,-20)"><circle cx="0" cy="0" r="4"/><polygon points="0,4 -4,14 4,14"/><polygon points="0,14 -4,24 4,24"/></g>
          <g transform="translate(40,-20)"><circle cx="0" cy="0" r="4"/><polygon points="0,4 -4,14 4,14"/><polygon points="0,14 -4,24 4,24"/></g>
          <g transform="translate(-50,20)"><circle cx="0" cy="0" r="4"/><polygon points="0,4 -4,14 4,14"/><polygon points="0,14 -4,24 4,24"/></g>
          <g transform="translate(50,20)"><circle cx="0" cy="0" r="4"/><polygon points="0,4 -4,14 4,14"/><polygon points="0,14 -4,24 4,24"/></g>
          <g transform="translate(0,-50)"><circle cx="0" cy="0" r="4"/><polygon points="0,4 -4,14 4,14"/><polygon points="0,14 -4,24 4,24"/></g>
          <g transform="translate(0,50)"><circle cx="0" cy="0" r="4"/><polygon points="0,4 -4,14 4,14"/><polygon points="0,14 -4,24 4,24"/></g>
        </g>
        <!-- Warli Sun & Tree Elements -->
        <circle cx="-95" cy="-75" r="12" fill="#FFFFFF" />
        <path d="M-95,-95 L-95,-55 M-115,-75 L-75,-75 M-108,-88 L-82,-62 M-108,-62 L-82,-88" stroke="#FFFFFF" stroke-width="1.5" />
        <!-- Triangular Palm Tree -->
        <polygon points="90,-40 75,-25 105,-25" fill="#FFFFFF" />
        <polygon points="90,-25 70,-10 110,-10" fill="#FFFFFF" />
        <line x1="90" y1="-10" x2="90" y2="20" stroke="#FFFFFF" stroke-width="2" />
      </g>`;
  } else {
    // Metal / Terracotta craft
    graphic = `
      <g transform="translate(250, 230)">
        <ellipse cx="0" cy="130" rx="80" ry="14" fill="#CBD5E0" fill-opacity="0.5" />
        <path d="M-70,110 L-60,-20 C-60,-80 60,-80 60,-20 L70,110 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="4" />
        <circle cx="0" cy="-30" r="40" fill="${secondaryColor}" fill-opacity="0.4" />
        <path d="M-40,30 L40,30 M-50,60 L50,60 M-60,90 L60,90" stroke="${secondaryColor}" stroke-width="3" stroke-linecap="round" />
      </g>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${bgGrad}
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="${isEnhanced ? '0.12' : '0.25'}" />
    </filter>
  </defs>
  
  <rect width="500" height="500" fill="url(#bg)" />
  
  <!-- Guide Lines (Raw only) -->
  ${!isEnhanced ? `
    <rect x="50" y="50" width="400" height="400" fill="none" stroke="#A0AEC0" stroke-width="1.5" stroke-dasharray="10,10" opacity="0.6" />
    <circle cx="250" cy="250" r="6" fill="#E53E3E" />
  ` : ''}

  <!-- Graphic Item with Soft Shadow -->
  <g filter="url(#softShadow)">
    ${graphic}
  </g>

  ${badge}

  <!-- Craft Title Bar -->
  <rect x="25" y="415" width="450" height="65" rx="14" fill="#1A202C" fill-opacity="0.88" />
  <text x="45" y="443" fill="#F7FAFC" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">${title}</text>
  <text x="45" y="465" fill="#CBD5E0" font-family="system-ui, sans-serif" font-size="13">${subtitle}</text>
</svg>`;
}

// Generate sample assets
const assets = [
  {
    filename: 'sample_raw_1.svg',
    title: 'Banarasi Kadwa Silk Saree (Raw Photo)',
    subtitle: 'Lighting: Shadows & uneven background | Aspect: 1:1',
    isEnhanced: false,
    primaryColor: '#9B2C2C',
    secondaryColor: '#D69E2E',
    iconType: 'textile'
  },
  {
    filename: 'sample_enhanced_1.svg',
    title: 'Banarasi Kadwa Silk Saree (AI Studio)',
    subtitle: 'Studio backdrop removed | Balanced gold luster | Ready for E-Commerce',
    isEnhanced: true,
    primaryColor: '#C53030',
    secondaryColor: '#ECC94B',
    iconType: 'textile'
  },
  {
    filename: 'sample_raw_2.svg',
    title: 'Jaipur Blue Ceramic Vase (Raw Photo)',
    subtitle: 'Lighting: Workshop table glare | Aspect: 1:1',
    isEnhanced: false,
    primaryColor: '#2B6CB0',
    secondaryColor: '#E2E8F0',
    iconType: 'pottery'
  },
  {
    filename: 'sample_enhanced_2.svg',
    title: 'Jaipur Blue Ceramic Vase (AI Studio)',
    subtitle: 'Studio clean white pedestal | Glaze reflection balanced | E-Commerce Ready',
    isEnhanced: true,
    primaryColor: '#3182CE',
    secondaryColor: '#FFFFFF',
    iconType: 'pottery'
  },
  {
    filename: 'sample_painting_raw.svg',
    title: 'Madhubani Tree of Life (Raw Canvas)',
    subtitle: 'Natural Pigments on Khadi Paper | Workshop Capture | Unframed',
    isEnhanced: false,
    primaryColor: '#744210',
    secondaryColor: '#276749',
    iconType: 'painting_madhubani'
  },
  {
    filename: 'sample_painting_enhanced.svg',
    title: 'Madhubani Tree of Life (AI Studio Enhanced)',
    subtitle: 'Mithila Folk School | Pigment Saturation Balanced | 1:1 E-Commerce Ready',
    isEnhanced: true,
    primaryColor: '#744210',
    secondaryColor: '#2F855A',
    iconType: 'painting_madhubani'
  },
  {
    filename: 'sample_painting_warli.svg',
    title: 'Warli Tarpa Harvest Dance (Mud-Cloth)',
    subtitle: 'Natural Rice Paste on Ochre Earth | Authentic Tribal Art of Maharashtra',
    isEnhanced: true,
    primaryColor: '#7B341E',
    secondaryColor: '#FFFFFF',
    iconType: 'painting_warli'
  }
];

assets.forEach(item => {
  const filePath = path.join(uploadsDir, item.filename);
  fs.writeFileSync(filePath, createCraftSvg(item), 'utf-8');
  // Also create .jpg alias pointing to svg or readable
  fs.writeFileSync(path.join(uploadsDir, item.filename.replace('.svg', '.jpg')), createCraftSvg(item), 'utf-8');
});

console.log('[Assets] Created sample SVG/JPG product preview images including traditional paintings in backend/uploads/.');

console.log('[Assets] Created sample SVG/JPG product preview images in backend/uploads/.');
