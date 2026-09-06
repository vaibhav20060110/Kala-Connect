-- kalaSetu PostgreSQL Database Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artisans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  craft_type VARCHAR(100) NOT NULL,
  location VARCHAR(150) NOT NULL,
  language_pref VARCHAR(10) DEFAULT 'hi',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  artisan_id TEXT NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_hi TEXT,
  raw_image_url TEXT,
  enhanced_image_url TEXT,
  audio_notes_url TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  material_cost NUMERIC(10, 2) DEFAULT 0,
  hours_spent NUMERIC(6, 1) DEFAULT 1,
  status VARCHAR(30) DEFAULT 'draft', -- 'draft', 'published', 'synced_gem'
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_suggestions (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  suggested_min NUMERIC(10, 2) NOT NULL,
  suggested_max NUMERIC(10, 2) NOT NULL,
  suggested_price NUMERIC(10, 2) NOT NULL,
  justification TEXT NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comparables (
  id TEXT PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  craft_name VARCHAR(150) NOT NULL,
  state VARCHAR(100) NOT NULL,
  avg_crafting_hours NUMERIC(6, 1) NOT NULL,
  min_price NUMERIC(10, 2) NOT NULL,
  max_price NUMERIC(10, 2) NOT NULL,
  typical_margin_percent NUMERIC(5, 2) NOT NULL,
  market_notes TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  artisan_id TEXT REFERENCES artisans(id) ON DELETE SET NULL,
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  customer_address TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(32) DEFAULT 'upi', -- 'upi', 'cod', 'card'
  status VARCHAR(32) DEFAULT 'confirmed', -- 'confirmed', 'dispatched', 'delivered'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

