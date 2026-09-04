import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;
let pool = null;
let isPostgres = false;

// In-memory fallback data store if external PostgreSQL is not available
const storePath = path.join(__dirname, 'store.json');
let inMemoryStore = {
  users: [],
  artisans: [],
  products: [],
  price_suggestions: [],
  comparables: []
};

// Load saved store if available
if (fs.existsSync(storePath)) {
  try {
    inMemoryStore = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
  } catch (err) {
    console.warn('[DB] Failed to load local store.json, using fresh memory state:', err.message);
  }
}

function persistStore() {
  try {
    fs.writeFileSync(storePath, JSON.stringify(inMemoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error saving store to disk:', err.message);
  }
}

// Parse seeds.sql to populate in-memory comparables if empty
function loadSeedsIntoMemory() {
  if (inMemoryStore.comparables.length > 0) return;
  const seedsFile = path.join(__dirname, 'seeds.sql');
  if (fs.existsSync(seedsFile)) {
    const content = fs.readFileSync(seedsFile, 'utf-8');
    const regex = /\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*'([^']+)'\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      inMemoryStore.comparables.push({
        id: match[1],
        category: match[2],
        craft_name: match[3],
        state: match[4],
        avg_crafting_hours: parseFloat(match[5]),
        min_price: parseFloat(match[6]),
        max_price: parseFloat(match[7]),
        typical_margin_percent: parseFloat(match[8]),
        market_notes: match[9]
      });
    }
    console.log(`[DB] Seeded ${inMemoryStore.comparables.length} handicraft comparables into local store.`);
    persistStore();
  }
}

export async function initDatabase() {
  if (databaseUrl) {
    try {
      console.log('[DB] Connecting to PostgreSQL at:', databaseUrl.replace(/:[^:@]+@/, ':****@'));
      pool = new Pool({ connectionString: databaseUrl });
      const client = await pool.connect();
      console.log('[DB] Connected successfully to PostgreSQL database.');

      const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
      await client.query(schema);

      // Check if comparables are seeded
      const countRes = await client.query('SELECT count(*) FROM comparables');
      if (parseInt(countRes.rows[0].count, 10) === 0) {
        console.log('[DB] Seeding comparables table in PostgreSQL...');
        const seeds = fs.readFileSync(path.join(__dirname, 'seeds.sql'), 'utf-8');
        await client.query(seeds);
      }
      client.release();
      isPostgres = true;
      return;
    } catch (err) {
      console.warn('[DB] PostgreSQL connection failed. Falling back to built-in local store:', err.message);
      isPostgres = false;
    }
  } else {
    console.log('[DB] No DATABASE_URL provided. Running with built-in zero-config store for instant demo.');
    isPostgres = false;
  }

  loadSeedsIntoMemory();
  // Ensure default demo artisan exists
  ensureDemoArtisan();
}

function ensureDemoArtisan() {
  const demoUserId = 'user-demo-01';
  const demoArtisanId = 'artisan-demo-01';
  if (!inMemoryStore.users.find(u => u.id === demoUserId)) {
    inMemoryStore.users.push({
      id: demoUserId,
      phone: '+91 9876543210',
      created_at: new Date().toISOString()
    });
  }
  if (!inMemoryStore.artisans.find(a => a.id === demoArtisanId)) {
    inMemoryStore.artisans.push({
      id: demoArtisanId,
      user_id: demoUserId,
      name: 'Radha Devi (राधा देवी)',
      craft_type: 'Handloom & Zari Weaving',
      location: 'Varanasi, Uttar Pradesh',
      language_pref: 'hi',
      created_at: new Date().toISOString()
    });
  }
  // Add 2 initial demo products if empty
  if (inMemoryStore.products.length === 0) {
    inMemoryStore.products.push({
      id: 'prod-demo-1',
      artisan_id: demoArtisanId,
      title_en: 'Banarasi Kadwa Silk Dupatta',
      title_hi: 'बनारसी कड़वा सिल्क दुपट्टा',
      description_en: 'Hand-woven pure mulberry silk dupatta with delicate floral gold zari motifs along the border.',
      description_hi: 'शुद्ध शहतूत रेशम पर हाथ से बुना पारंपरिक दुपट्टा, किनारों पर सोने की बारीक जरी का काम।',
      raw_image_url: '/uploads/sample_raw_1.jpg',
      enhanced_image_url: '/uploads/sample_enhanced_1.jpg',
      audio_notes_url: null,
      price: 2450.00,
      category: 'Textiles',
      material_cost: 950.00,
      hours_spent: 16.0,
      status: 'published',
      views: 142,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
    });

    inMemoryStore.products.push({
      id: 'prod-demo-2',
      artisan_id: demoArtisanId,
      title_en: 'Jaipur Hand-painted Blue Ceramic Vase',
      title_hi: 'जयपुर हस्तनिर्मित ब्लू पॉटरी फूलदान',
      description_en: 'Traditional lead-free blue pottery vase with Persian cobalt floral designs.',
      description_hi: 'पारंपरिक नीली मिट्टी का फूलदान, हस्तनिर्मित फारसी कोबाल्ट फूलों की कलाकृति।',
      raw_image_url: '/uploads/sample_raw_2.jpg',
      enhanced_image_url: '/uploads/sample_enhanced_2.jpg',
      audio_notes_url: null,
      price: 1150.00,
      category: 'Pottery',
      material_cost: 380.00,
      hours_spent: 8.0,
      status: 'published',
      views: 89,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    });
  }
  persistStore();
}

/**
 * Universal query runner:
 * If PostgreSQL is connected, runs standard SQL.
 * If running local fallback, routes to memory store.
 */
export async function query(sql, params = []) {
  if (isPostgres && pool) {
    return pool.query(sql, params);
  }

  // Local fallback SQL simulator
  const lower = sql.trim().toLowerCase();

  // SELECT from comparables
  if (lower.includes('from comparables')) {
    let rows = [...inMemoryStore.comparables];
    if (lower.includes('where category = $1') && params[0]) {
      const cat = String(params[0]).toLowerCase();
      rows = rows.filter(r => r.category.toLowerCase() === cat);
    }
    return { rows, rowCount: rows.length };
  }

  // SELECT from users
  if (lower.includes('from users')) {
    if (lower.includes('where phone = $1')) {
      const rows = inMemoryStore.users.filter(u => u.phone === params[0]);
      return { rows, rowCount: rows.length };
    }
    if (lower.includes('where id = $1')) {
      const rows = inMemoryStore.users.filter(u => u.id === params[0]);
      return { rows, rowCount: rows.length };
    }
    return { rows: inMemoryStore.users, rowCount: inMemoryStore.users.length };
  }

  // INSERT INTO users
  if (lower.startsWith('insert into users')) {
    const user = { id: params[0], phone: params[1], created_at: new Date().toISOString() };
    inMemoryStore.users.push(user);
    persistStore();
    return { rows: [user], rowCount: 1 };
  }

  // SELECT from artisans
  if (lower.includes('from artisans')) {
    if (lower.includes('where user_id = $1')) {
      const rows = inMemoryStore.artisans.filter(a => a.user_id === params[0]);
      return { rows, rowCount: rows.length };
    }
    if (lower.includes('where id = $1')) {
      const rows = inMemoryStore.artisans.filter(a => a.id === params[0]);
      return { rows, rowCount: rows.length };
    }
    return { rows: inMemoryStore.artisans, rowCount: inMemoryStore.artisans.length };
  }

  // INSERT INTO artisans
  if (lower.startsWith('insert into artisans')) {
    const artisan = {
      id: params[0],
      user_id: params[1],
      name: params[2],
      craft_type: params[3],
      location: params[4],
      language_pref: params[5] || 'hi',
      created_at: new Date().toISOString()
    };
    inMemoryStore.artisans.push(artisan);
    persistStore();
    return { rows: [artisan], rowCount: 1 };
  }

  // SELECT from products
  if (lower.includes('from products')) {
    let rows = [...inMemoryStore.products];
    if (lower.includes('where artisan_id = $1')) {
      rows = rows.filter(p => p.artisan_id === params[0]);
    } else if (lower.includes('where id = $1')) {
      rows = rows.filter(p => p.id === params[0]);
    }
    // Sort descending by created_at
    rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows, rowCount: rows.length };
  }

  // INSERT INTO products
  if (lower.startsWith('insert into products')) {
    const prod = {
      id: params[0],
      artisan_id: params[1],
      title_en: params[2],
      title_hi: params[3],
      description_en: params[4],
      description_hi: params[5],
      raw_image_url: params[6],
      enhanced_image_url: params[7],
      audio_notes_url: params[8],
      price: parseFloat(params[9] || 0),
      category: params[10],
      material_cost: parseFloat(params[11] || 0),
      hours_spent: parseFloat(params[12] || 1),
      status: params[13] || 'draft',
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    inMemoryStore.products.unshift(prod);
    persistStore();
    return { rows: [prod], rowCount: 1 };
  }

  // UPDATE products
  if (lower.startsWith('update products')) {
    const id = params[params.length - 1];
    const index = inMemoryStore.products.findIndex(p => p.id === id);
    if (index !== -1) {
      // Dynamic patch for fields passed
      if (lower.includes('status = $1')) {
        inMemoryStore.products[index].status = params[0];
      }
      if (lower.includes('price = $1')) {
        inMemoryStore.products[index].price = parseFloat(params[0]);
      }
      inMemoryStore.products[index].updated_at = new Date().toISOString();
      persistStore();
      return { rows: [inMemoryStore.products[index]], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // INSERT INTO price_suggestions
  if (lower.startsWith('insert into price_suggestions')) {
    const suggestion = {
      id: params[0],
      product_id: params[1],
      suggested_min: parseFloat(params[2]),
      suggested_max: parseFloat(params[3]),
      suggested_price: parseFloat(params[4]),
      justification: params[5],
      accepted: params[6] === true || params[6] === 'true',
      created_at: new Date().toISOString()
    };
    inMemoryStore.price_suggestions.push(suggestion);
    persistStore();
    return { rows: [suggestion], rowCount: 1 };
  }

  // Default fallback
  return { rows: [], rowCount: 0 };
}

export function getLocalStore() {
  return inMemoryStore;
}
