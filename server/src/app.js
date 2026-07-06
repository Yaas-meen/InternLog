import express      from 'express';
import cors         from 'cors';
import helmet       from 'helmet';
import cookieParser from 'cookie-parser';
import morgan       from 'morgan';
import rateLimit    from 'express-rate-limit';
import path         from 'path';
import { fileURLToPath } from 'url';
import dotenv       from 'dotenv';

import authRoutes   from './routes/auth.routes.js';
import logRoutes    from './routes/log.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import reportRoutes from './routes/report.routes.js';
import userRoutes   from './routes/user.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

//  Security 
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin:      ALLOWED_ORIGINS,
  credentials: true,
}));

app.use(helmet({
  crossOriginResourcePolicy:  { policy: 'cross-origin' },
  crossOriginEmbedderPolicy:  false,
  crossOriginOpenerPolicy:    false,
}));

//  Parsers 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

//  Static files 
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//  Rate limiting 
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message:  { success: false, message: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      200,
  message:  { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

app.use('/api/v1', generalLimiter);

//  Routes 
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/logs', logRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/users', userRoutes);

//  Health check 
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SIWES Journal API is running',
    env:     process.env.NODE_ENV,
    version: '1.0.0',
  });
});

//  404 handler 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

//  Global error handler 
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal server error';

  if (process.env.NODE_ENV === 'development') {
    console.error(' Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;