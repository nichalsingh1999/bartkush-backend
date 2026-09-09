// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { sendEmailNotification } = require('../services/emailService');

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod } = req.body;
    
    console.log('📥 Order received:', { customerName, totalAmount, itemsCount: items?.length });
    
    // Validate
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }
    if (!totalAmount) {
      return res.status(400).json({ success: false, message: 'Total amount is required' });
    }
    if (!customerName) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    if (!customerPhone) {
      return res.status(400).json({ success: false, message: 'Customer phone is required' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }
    
    // Create order
    const order = new Order({
      items,
      totalAmount,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Pending'
    });
    
    await order.save();
    console.log(`✅ Order saved: ${order.orderId}`);
    
    // Send email
    const emailResult = await sendEmailNotification(order);
    console.log('📧 Email result:', emailResult.success ? 'Sent ✅' : 'Failed ❌');
    
    res.status(201).json({
      success: true,
      order,
      emailNotification: emailResult
    });
    
  } catch (error) {
    console.error('❌ Order error:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: error.message 
    });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;