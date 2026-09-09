// server/services/emailService.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Format order email
const formatOrderEmail = (order) => {
  const itemsList = order.items.map((item, index) => {
    return `${index + 1}. ${item.name} - Rs ${item.price} x ${item.quantity} = Rs ${(item.price * item.quantity).toFixed(2)}`;
  }).join('\n');

  const customerPhone = order.customerPhone.replace('+', '');
  const whatsappLink = `https://wa.me/${customerPhone}`;

  return `
🛍️ NEW ORDER RECEIVED 🛍️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID: #${order.orderId}
Date: ${new Date(order.createdAt).toLocaleString()}
Status: ${order.status || 'Pending'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER DETAILS:
👤 Name: ${order.customerName || 'Guest'}
📧 Email: ${order.customerEmail || 'N/A'}
📱 Phone: ${order.customerPhone || 'N/A'}

📱 WhatsApp Link (Click to chat):
${whatsappLink}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORDER ITEMS:
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Total Amount: Rs ${order.totalAmount.toFixed(2)}
💳 Payment Method: ${order.paymentMethod || 'Cash on Delivery'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Shipping Address:
${order.shippingAddress || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 ACTION REQUIRED:
Click the WhatsApp link above to confirm the order with the customer.

Thank you for your order! 🙏
  `;
};

// Send email notification
const sendEmailNotification = async (order) => {
  try {
    const emailBody = formatOrderEmail(order);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: `🛍️ New Order Received - #${order.orderId}`,
      text: emailBody
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent for order ${order.orderId}`);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmailNotification };