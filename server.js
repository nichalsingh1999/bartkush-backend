const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Initialize Express FIRST before using 'app'
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import your product routes (adjust path if your file structure is different)
const productRoutes = require('./routes/productRoutes'); 

// 2. Now use 'app' safely
app.use('/api/products', productRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/bart-kush-store'; // Update if using Atlas

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log('Database connection error:', err));