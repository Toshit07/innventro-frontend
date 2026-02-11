import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load env vars
dotenv.config();

// Import routes
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// CORS with strict settings
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
}));

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware with security info
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ip = req.ip;
  console.log(`${timestamp} - ${method} ${path} - IP: ${ip}`);
  next();
});

// Database Connection with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/innoventure', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => {
    console.error('✗ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Connection event handlers
mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB Error:', err);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════╗
║     INNOVENTURE BACKEND LIVE      ║
║     Server on port ${PORT}           ║
╚═══════════════════════════════════╝
  `);
});
