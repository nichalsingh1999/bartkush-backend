// server/models/Order.js
const mongoose = require('mongoose');

// Generate order ID function
function generateOrderId() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK-${timestamp}-${random}`;
}

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    unique: true,
    default: generateOrderId
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  totalAmount: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  emailSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);