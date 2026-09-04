# KalaConnect (हस्तशिल्प व्यापार साथी)
### AI-Powered Virtual Business Manager for Indian Artisans

KalaConnect empowers traditional rural Indian artisans with artificial intelligence tools:
- 📸 **AI Studio Image Enhancer**: Cleans raw product photography, corrects lighting, and frames items into e-commerce 1:1 catalog assets.
- 🎙️ **Multilingual Voice Auto-Cataloger**: Transcribes artisan voice descriptions in regional languages (Hindi, English) and generates SEO product titles, tags, and stories.
- ⚖️ **Fair-Trade Dynamic Pricing Assistant**: Combines raw material costs, crafting labor hours, and economic benchmarks to compute sustainable livelihood pricing.
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
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/kalaconnect
```

> **Note**: If `DATABASE_URL` is empty, KalaConnect automatically runs with its built-in zero-config in-memory store so you can demo immediately without waiting!

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

## 🛡️ Security & Git Best Practices
- `.env` files are tracked in `.gitignore` and untracked from Git history.
- Uploaded media and node_modules are excluded from the git repository.
