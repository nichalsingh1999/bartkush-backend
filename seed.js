// Pointing to the .env file in the parent directory (adjust if .env is in the same folder)
require('dotenv').config({ path: '../.env' }); 
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Verify that the URI is loaded before connecting
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in your .env file.");
  process.exit(1);
}

// Array of products for your store categories
const productsData = [
  {
    name: "The Echoes Of The West (Vinyl LP)",
    price: 35.00,
    category: "ALBUMS",
    description: "Official audio record masterclass edition."
  },
  {
    name: "Masterclass Heavyweight Vintage Tee",
    price: 45.00,
    category: "T-SHIRTS",
    description: "Premium garment-dyed cotton streetwear tee."
  },
  {
    name: "BartKush Signature Embroidered Cap",
    price: 30.00,
    category: "CAPS",
    description: "Structured premium headwear with high-density embroidery."
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for seeding...");
    
    // Optional: Clears out old products so you don't create duplicate entries
    await Product.deleteMany({});
    
    // Insert the multiple products into MongoDB
    await Product.insertMany(productsData);
    
    console.log("All products (Albums, T-Shirts, Caps) added successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
    process.exit(1);
  });