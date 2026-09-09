// server/server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bart-kush-store';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Products endpoint: http://localhost:${PORT}/api/products`);
      console.log(`📦 Orders endpoint: http://localhost:${PORT}/api/orders`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  });