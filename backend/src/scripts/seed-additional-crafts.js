import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, query, closeDatabase } from '../db/index.js';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newProducts = [
  {
    id: 'prod-pot-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Handcrafted Terracotta Water Pot (Matka)',
    title_hi: 'मिट्टी का नक्काशीदार पारंपरिक जल पात्र (मटका)',
    description_en: 'Handcrafted unglazed terracotta clay pot with traditional etched floral neck patterns. Naturally keeps water cool through porous micro-evaporation.',
    description_hi: 'पारंपरिक नक्काशीदार प्राकृतिक लाल मिट्टी का मटका। सूक्ष्म वाष्पीकरण से जल को स्वाभाविक रूप से ठंडा व शुद्ध रखने वाला।',
    raw_image_url: '/uploads/sample_terracotta_pot_raw.svg',
    enhanced_image_url: '/uploads/sample_terracotta_pot_enhanced.svg',
    audio_notes_url: null,
    price: 850.00,
    category: 'Pottery',
    material_cost: 240.00,
    hours_spent: 7.0,
    status: 'published',
    views: 186
  },
  {
    id: 'prod-clay-02',
    artisan_id: 'artisan-demo-01',
    title_en: 'Terracotta Chai Kulhad & Tableware Set (Set of 6)',
    title_hi: 'पारंपरिक मिट्टी के कुल्हड़ व पात्र सेट (6 कुल्हड़ व ढक्कनदार हांडी)',
    description_en: 'Set of authentic kiln-baked terracotta clay kulhad tea cups and clay serving pots with lid. Enhances chai aroma with natural earthy notes.',
    description_hi: 'पारंपरिक भट्टी में पके मिट्टी के कुल्हड़ और ढक्कनदार पात्रों का सेट। चाय की सोंधी खुशबू व प्राकृतिक स्वाद से भरपूर।',
    raw_image_url: '/uploads/sample_clay_items_raw.svg',
    enhanced_image_url: '/uploads/sample_clay_items_enhanced.svg',
    audio_notes_url: null,
    price: 650.00,
    category: 'Pottery',
    material_cost: 180.00,
    hours_spent: 5.0,
    status: 'published',
    views: 124
  },
  {
    id: 'prod-mat-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Handwoven Natural River Grass Floor Mat (Madur Chatai)',
    title_hi: 'पारंपरिक हस्तनिर्मित मादुर घास फर्श चटाई',
    description_en: 'Eco-friendly handwoven Madur Kathi river grass floor mat with traditional geometric borders. Breathable, cooling, organic, and long-lasting.',
    description_hi: 'प्राकृतिक मादुर काठी नदी घास से बुनी पारंपरिक फर्श चटाई, बारीक ज्यामितीय बॉर्डर के साथ। ग्रीष्मकालीन शीतलता प्रदायक व टिकाऊ।',
    raw_image_url: '/uploads/sample_grass_mat_raw.svg',
    enhanced_image_url: '/uploads/sample_grass_mat_enhanced.svg',
    audio_notes_url: null,
    price: 1450.00,
    category: 'Fiber',
    material_cost: 450.00,
    hours_spent: 14.0,
    status: 'published',
    views: 158
  },
  {
    id: 'prod-cottage-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Cottage Industry Handcrafted Sabai Grass Basket',
    title_hi: 'सबाई घास और प्राकृतिक बेंत कॉटेज भंडारण टोकरी',
    description_en: 'Multi-purpose handcrafted cottage storage basket made from braided wild Sabai grass and treated cane with fitted woven lid. Sustainable home utility.',
    description_hi: 'ग्रामीण कुटीर उद्योग द्वारा निर्मित सबाई घास और बेंत की मजबूत ढक्कनदार भंडारण टोकरी। 100% पर्यावरण अनुकूल व बहुउपयोगी।',
    raw_image_url: '/uploads/sample_cottage_basket_raw.svg',
    enhanced_image_url: '/uploads/sample_cottage_basket_enhanced.svg',
    audio_notes_url: null,
    price: 1150.00,
    category: 'Cottage',
    material_cost: 320.00,
    hours_spent: 9.0,
    status: 'published',
    views: 112
  }
];

async function seed() {
  await initDatabase();

  for (const p of newProducts) {
    await query(`
      INSERT INTO products (
        id, artisan_id, title_en, title_hi, description_en, description_hi,
        raw_image_url, enhanced_image_url, audio_notes_url, price, category,
        material_cost, hours_spent, status, views
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO UPDATE SET
        title_en = EXCLUDED.title_en,
        title_hi = EXCLUDED.title_hi,
        description_en = EXCLUDED.description_en,
        description_hi = EXCLUDED.description_hi,
        raw_image_url = EXCLUDED.raw_image_url,
        enhanced_image_url = EXCLUDED.enhanced_image_url,
        price = EXCLUDED.price,
        category = EXCLUDED.category,
        material_cost = EXCLUDED.material_cost,
        hours_spent = EXCLUDED.hours_spent;
    `, [
      p.id, p.artisan_id, p.title_en, p.title_hi, p.description_en, p.description_hi,
      p.raw_image_url, p.enhanced_image_url, p.audio_notes_url, p.price, p.category,
      p.material_cost, p.hours_spent, p.status, p.views
    ]);
    console.log('Seeded product:', p.title_en);
  }

  // Update store.json if exists
  const storePath = path.join(__dirname, '..', '..', 'data', 'store.json');
  if (fs.existsSync(storePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
      if (Array.isArray(data.products)) {
        for (const np of newProducts) {
          const idx = data.products.findIndex(p => p.id === np.id);
          if (idx >= 0) {
            data.products[idx] = { ...data.products[idx], ...np, updated_at: new Date().toISOString() };
          } else {
            data.products.push({ ...np, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
          }
        }
        fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Updated local store.json with new craft products.');
      }
    } catch (e) {
      console.warn('Could not update store.json:', e.message);
    }
  }

  const res = await query('SELECT count(*) FROM products');
  console.log('Total products in database now:', res.rows[0].count);
  await closeDatabase();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
