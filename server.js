// server/server.js
// ✅ Smart env loading: works locally AND on Render
if (process.env.NODE_ENV !== 'production' && !process.env.RENDER) {
  require('dotenv').config({ path: '../.env' });
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Pre-Save Model
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

// ✅ PRE-SAVE ROUTE
app.post('/api/pre-save', async (req, res) => {
  try {
    const { albumId, albumName, customerEmail } = req.body;

    if (!albumId || !albumName || !customerEmail) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existing = await PreSave.findOne({ albumId, customerEmail });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Already pre-saved' });
    }

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

// ✅ VIEW ALL PRE-SAVES
app.get('/api/pre-saves', async (req, res) => {
  try {
    const preSaves = await PreSave.find().sort({ date: -1 });
    res.json({ success: true, count: preSaves.length, preSaves });
  } catch (error) {
    console.error('❌ Fetch pre-saves error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bart-kush-store';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Products endpoint: http://localhost:${PORT}/api/products`);
      console.log(`📦 Orders endpoint: http://localhost:${PORT}/api/orders`);
      console.log(`🔔 Pre-Save endpoint: http://localhost:${PORT}/api/pre-save`);
      console.log(`📋 View Pre-Saves: http://localhost:${PORT}/api/pre-saves`);
      console.log(`📧 Email provider: Resend`);
      console.log(`📧 Owner email: ${process.env.OWNER_EMAIL || 'NOT SET'}`);
      console.log(`🔑 Resend key loaded: ${process.env.RESEND_API_KEY ? 'YES' : 'NO'}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  });