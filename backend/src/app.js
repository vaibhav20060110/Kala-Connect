import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import aiRoutes from './routes/ai.routes.js';
import orderRoutes from './routes/order.routes.js';
import { getDbStatus } from './db/index.js';
import { getAiStatus } from './services/geminiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads serving
const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Static interactive demo app serving
const publicDir = path.join(__dirname, '..', 'public');
app.use('/demo', express.static(path.join(publicDir, 'demo')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'kalaSetu AI Virtual Business Manager Backend',
    database: getDbStatus(),
    ai: getAiStatus(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/ai', aiRoutes);
app.use('/orders', orderRoutes);

// Root redirect to demo
app.get('/', (req, res) => {
  res.redirect('/demo');
});

// Friendly error handling
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    friendly_prompt: 'कुछ गलत हो गया, कृपया पुनः प्रयास करें (Something went wrong, please try again)'
  });
});

export default app;
