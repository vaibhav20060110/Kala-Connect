# kalaSetu (हस्तशिल्प व्यापार साथी)
### AI-Powered Virtual Business Manager for Indian Artisans

kalaSetu empowers traditional rural Indian artisans with artificial intelligence tools:
- 📸 **AI Studio Image Enhancer**: Cleans raw product photography, corrects lighting, and frames items into e-commerce 1:1 catalog assets.
- 🖼️ **Traditional Art & Wall Visualizer**: Realistic AR/wall preview allowing buyers to visualize traditional folk paintings (Madhubani, Warli, Pattachitra) in modern living rooms, complete with dynamic frames.
- 📜 **Cryptographic Certificate of Authenticity (COA)**: Generates verifiable artisan provenance certificates with GI tags, materials breakdown, and signature seals to prevent counterfeit crafts.
- 🏺 **Multi-Craft Heritage Catalog**: Dedicated presets and categories for Terracotta Pottery (Mitti ke Bartan, Kulhads), Handwoven River Grass Mats (Madur Kathi), Bamboo Cottage Baskets, Heritage Textiles, and Dokra Metalcraft.
- 🎙️ **Multilingual Voice Auto-Cataloger**: Transcribes artisan voice descriptions in regional languages (Hindi, English) and generates SEO product titles, tags, and stories.
- ⚖️ **Fair-Trade Dynamic Pricing Assistant**: Combines raw material costs, crafting labor hours, and economic benchmarks to compute sustainable livelihood pricing.
- 💬 **1-Click WhatsApp Artisan Showcase**: Instant deep-linked social commerce sharing with pre-formatted artisan stories, fair prices, and direct verification links.
- 🌐 **Full English / Hindi Localization**: 100% bilingual UI with seamless live toggle between English and शुद्ध हिंदी.
- 🐘 **PostgreSQL Cloud & Local Storage**: Enterprise-ready relational database with automated schema migrations and instant zero-config fallback.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: >= 18.0.0
- **Git**

---

### 2. Environment Configuration

Navigate to the `backend` folder and open `.env`:
```bash
cd backend
```

Your `backend/.env` file contains:
```env
PORT=5000
DATABASE_URL=
GEMINI_API_KEY=
```

> [!IMPORTANT]
> The `.env` file contains private credentials and is protected by `.gitignore` so it is **never pushed to GitHub**.

---

### 3. Connecting PostgreSQL Database

You can connect either a **free cloud PostgreSQL** database or a **local PostgreSQL** instance:

#### Option A: Free Cloud PostgreSQL (Recommended - Neon / Supabase)
1. **Neon** (Instant 1-minute setup):
   - Go to [neon.tech](https://neon.tech/) and create a free project.
   - Copy the Connection String.
   - Set in `backend/.env`:
     ```env
     DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require
     ```
2. **Supabase**:
   - Go to [supabase.com](https://supabase.com/) and create a free project.
   - Under Project Settings -> Database, copy URI.
   - Set in `backend/.env`:
     ```env
     DATABASE_URL=postgresql://postgres:password@db.xyz.supabase.co:5432/postgres
     ```

#### Option B: Local PostgreSQL (Windows)
If you have PostgreSQL installed locally on your Windows machine:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/kalasetu
```

> **Note**: If `DATABASE_URL` is empty, kalaSetu automatically runs with its built-in zero-config in-memory store so you can demo immediately without waiting!

---

### 4. Connecting Google Gemini Generative AI API

1. Visit [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.
2. Click **Get API key** -> **Create API key**.
3. Copy your key and paste it into `backend/.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
*(You can also use `GOOGLE_API_KEY=AIzaSy...`)*

---

### 5. Testing Your Connections

The backend includes built-in verification scripts:

```bash
cd backend

# Test PostgreSQL connection & tables
npm run test:db

# Test Google Gemini API connection
npm run test:gemini

# Test both systems together
npm run check
```

---

### 6. Starting the Application

#### Start Backend Server & Interactive Demo:
```bash
cd backend
npm run dev
```

The server will start at:
- 🌐 **Interactive Demo Web App**: [http://localhost:5000/demo](http://localhost:5000/demo)
- 📦 **Health Diagnostic API**: [http://localhost:5000/health](http://localhost:5000/health)
- 🔌 **Backend REST API**: [http://localhost:5000](http://localhost:5000)

#### Start Mobile App (Flutter):
```bash
cd frontend
flutter pub get
flutter run
```

---

## 🎯 5-Step Presentation & Demo Guide (For Judges)

1. **Language & Onboarding**:
   - Open `http://localhost:5000/demo`.
   - Click the **"हिंदी / EN"** button in the header to show instant bilingual localization for rural artisans.
2. **One-Tap Craft Quick Select**:
   - Click any chip (**🏺 Clay Pot**, **☕ Clay Kulhad**, **🌾 Grass Mat**, **🧺 Cottage Basket**, or **🎨 Madhubani Painting**).
   - Show how the image, title, craft heritage, and pricing automatically populate.
3. **AI Studio Image Enhancement**:
   - Click **"✨ AI Studio Enhance Image"** to demonstrate automatic background cleanup, dynamic lighting, and marketplace framing.
4. **Art Painting Visualizer & Certificate (COA)**:
   - For paintings, tap **"🖼️ Preview on Living Room Wall"** to showcase AR scale simulation.
   - Tap **"📜 View Authenticity Certificate"** to showcase GI protection, artisan signature, and anti-counterfeit QR code.
5. **Fair-Trade Pricing & 1-Click WhatsApp Commerce**:
   - Move to Screen 9 to view the fair pricing breakdown (Raw Materials + Labor + GI Craft Premium).
   - Click **"💬 Share Catalog on WhatsApp"** to generate instant social commerce leads.

---

## 🛡️ Security & Git Best Practices
- `.env` files are protected by `.gitignore` and never committed to Git.
- Uploaded media and node_modules are excluded from the repository.
