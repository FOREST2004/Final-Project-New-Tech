import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { testConnection, syncDatabase } from './database/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4005;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3005',
    'http://localhost:5173',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Server is running successfully!',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Aquarium Shop API is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Aquarium Shop API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart'
    }
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    console.log('✅ Database connection established successfully');
    
    // Sync database (create tables if they don't exist)
    await syncDatabase();
    console.log('✅ Database synchronized successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Aquarium Shop Server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 API available at: http://localhost:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📍 API info: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();