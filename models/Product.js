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
  albumDetails: {
    tracklist: [
      {
        title: String,
        duration: String,
        artist: String,
        views: String,
        audioFile: String,
        youtubeLink: String // ✅ Added this field for individual track YouTube links
      }
    ],
    youtubeLink: String,
    releaseYear: String,
    label: String
  }
});

module.exports = mongoose.model('Product', productSchema);