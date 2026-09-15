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

// ✅ Pre-Save Model (defined here to avoid creating extra files)
const preSaveSchema = new mongoose.Schema({
  albumId: { type: String, required: true },
  albumName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
const PreSave = mongoose.model('PreSave', preSaveSchema);

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ✅ PRE-SAVE ROUTE (New)
app.post('/api/pre-save', async (req, res) => {
  try {
    const { albumId, albumName, customerEmail } = req.body;

    if (!albumId || !albumName || !customerEmail) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if this email already pre-saved this album
    const existing = await PreSave.findOne({ albumId, customerEmail });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Already pre-saved' });
    }

    // Save the pre-save to MongoDB
    const newPreSave = await PreSave.create({
      albumId,
      albumName,
      customerEmail
    });

    console.log(`🔔 New Pre-Save: "${albumName}" by ${customerEmail}`);

    res.json({ 
      success: true, 
      message: 'Pre-saved successfully',
      preSave: newPreSave
    });
  } catch (error) {
    console.error('❌ Pre-save error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ ROUTE TO VIEW ALL PRE-SAVES (For the artist to check later)
app.get('/api/pre-saves', async (req, res) => {
  try {
    const preSaves = await PreSave.find().sort({ date: -1 });
    res.json({ success: true, count: preSaves.length, preSaves });
  } catch (error) {
    console.error('❌ Fetch pre-saves error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

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
      console.log(`🔔 Pre-Save endpoint: http://localhost:${PORT}/api/pre-save`);
      console.log(`📋 View Pre-Saves: http://localhost:${PORT}/api/pre-saves`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  });