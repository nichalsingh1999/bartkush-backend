// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
  },
  description: { type: String },
  image: { type: String },
  // T-Shirt specific fields
  isLimitedEdition: { type: Boolean, default: false },
  sizes: [String],
  color: { type: String },
  // Album specific fields
  albumDetails: {
    tracklist: [
      {
        title: String,
        duration: String,
        artist: String,
        views: String,
        audioFile: String,
        youtubeLink: String
      }
    ],
    youtubeLink: String,
    releaseYear: String,
    label: String
  }
});

module.exports = mongoose.model('Product', productSchema);