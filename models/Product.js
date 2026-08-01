const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    // Removed strict lowercase enum validation so 'ALBUMS', 'T-SHIRTS', and 'CAPS' are accepted freely
  },
  description: { type: String },
  image: { type: String }
});

module.exports = mongoose.model('Product', productSchema);