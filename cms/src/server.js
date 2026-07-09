import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // In production, replace with specific domain or admin panel URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount REST API
app.use('/api', apiRouter);

// Serve static assets for Media uploaded images locally
app.use('/images/blog', express.static(path.resolve('../public/images/blog')));

// Serve admin client dashboard statically
app.use(express.static(path.join(__dirname, '../public')));

// Catch all routes for SPA admin client (redirect to index.html)
app.get('*', (req, res, next) => {
  // If request is for /api or static files, pass through
  if (req.path.startsWith('/api') || req.path.includes('.')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Server Error:', err.message);
  res.status(500).json({
    message: 'Đã xảy ra lỗi máy chủ nội bộ',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CMS Backend Server running at http://localhost:${PORT}`);
});
