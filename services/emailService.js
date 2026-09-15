// server/services/emailService.js
const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Format order email (HTML version — looks premium)
const formatOrderEmailHTML = (order) => {
  const itemsListHTML = order.items.map((item, index) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #333; color: #ccc;">${index + 1}. ${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #333; color: #d4af37; text-align: right;">Rs ${item.price} × ${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #333; color: #fff; text-align: right;">Rs ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const customerPhone = order.customerPhone.replace('+', '');
  const whatsappLink = `https://wa.me/${customerPhone}`;

  return `
    <div style="font-family: Arial, sans-serif; background: #0b0b0b; color: #fff; padding: 40px; max-width: 650px; margin: auto; border: 1px solid #d4af37;">
      
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #d4af37;">
        <h1 style="color: #d4af37; letter-spacing: 4px; margin: 0; font-size: 22px;">BARTKUSH MUSIC CO.</h1>
        <p style="color: #888; font-size: 11px; letter-spacing: 3px; margin-top: 8px;">NEW ORDER RECEIVED 🛍️</p>
      </div>

      <div style="padding: 25px 0;">
        <h2 style="color: #d4af37; font-size: 16px; margin: 0 0 15px 0;">Order #${order.orderId}</h2>
        <p style="color: #888; font-size: 12px; margin: 5px 0;">Date: ${new Date(order.createdAt).toLocaleString()}</p>
        <p style="color: #888; font-size: 12px; margin: 5px 0;">Status: ${order.status || 'Pending'}</p>
      </div>

      <div style="background: #111; padding: 20px; border-left: 3px solid #d4af37; margin-bottom: 25px;">
        <h3 style="color: #d4af37; font-size: 12px; letter-spacing: 2px; margin: 0 0 12px 0;">CUSTOMER DETAILS</h3>
        <p style="color: #ccc; font-size: 13px; margin: 6px 0;">👤 <strong>Name:</strong> ${order.customerName || 'Guest'}</p>
        <p style="color: #ccc; font-size: 13px; margin: 6px 0;">📧 <strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
        <p style="color: #ccc; font-size: 13px; margin: 6px 0;">📱 <strong>Phone:</strong> ${order.customerPhone || 'N/A'}</p>
        <p style="margin: 12px 0 0 0;">
          <a href="${whatsappLink}" style="background: #25D366; color: #fff; padding: 10px 20px; text-decoration: none; font-weight: bold; font-size: 12px; border-radius: 4px; display: inline-block;">
            💬 Chat on WhatsApp
          </a>
        </p>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="color: #d4af37; font-size: 12px; letter-spacing: 2px; margin: 0 0 12px 0;">ORDER ITEMS</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background: #111;">
              <th style="text-align: left; padding: 10px; color: #888; font-size: 11px;">ITEM</th>
              <th style="text-align: right; padding: 10px; color: #888; font-size: 11px;">UNIT</th>
              <th style="text-align: right; padding: 10px; color: #888; font-size: 11px;">TOTAL</th>
            </tr>
          </thead>
          <tbody>${itemsListHTML}</tbody>
        </table>
      </div>

      <div style="text-align: right; padding: 20px; border-top: 2px solid #d4af37; margin-bottom: 25px;">
        <p style="color: #888; font-size: 11px; margin: 0; letter-spacing: 2px;">TOTAL AMOUNT</p>
        <p style="color: #d4af37; font-size: 26px; font-weight: bold; margin: 5px 0;">Rs ${order.totalAmount.toFixed(2)}</p>
        <p style="color: #888; font-size: 12px; margin: 5px 0;">Payment: ${order.paymentMethod || 'Cash on Delivery'}</p>
      </div>

      <div style="background: #111; padding: 20px; border-left: 3px solid #d4af37; margin-bottom: 25px;">
        <h3 style="color: #d4af37; font-size: 12px; letter-spacing: 2px; margin: 0 0 10px 0;">📦 SHIPPING ADDRESS</h3>
        <p style="color: #ccc; font-size: 13px; margin: 0; line-height: 1.6;">${order.shippingAddress || 'N/A'}</p>
      </div>

      <div style="text-align: center; padding: 20px; background: #1a0000; border: 1px solid #ff4444; border-radius: 6px; margin-bottom: 20px;">
        <p style="color: #ff6666; font-size: 13px; margin: 0; font-weight: bold;">🔴 ACTION REQUIRED</p>
        <p style="color: #ccc; font-size: 12px; margin: 8px 0 0 0;">Contact the customer via WhatsApp to confirm.</p>
      </div>

      <div style="text-align: center; padding-top: 25px; border-top: 1px solid #333;">
        <p style="color: #666; font-size: 10px; letter-spacing: 3px; margin: 0;">BARTKUSH MUSIC CO. — MASTERCLASS STORE</p>
      </div>

    </div>
  `;
};

// Format plain text fallback
const formatOrderEmailText = (order) => {
  const itemsList = order.items.map((item, index) =>
    `${index + 1}. ${item.name} - Rs ${item.price} x ${item.quantity} = Rs ${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  const customerPhone = order.customerPhone.replace('+', '');
  const whatsappLink = `https://wa.me/${customerPhone}`;

  return `🛍️ NEW ORDER RECEIVED\n\nOrder #${order.orderId}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nWhatsApp: ${whatsappLink}\n\nItems:\n${itemsList}\n\nTotal: Rs ${order.totalAmount}\nAddress: ${order.shippingAddress}`;
};

// Send email notification via Resend
const sendEmailNotification = async (order) => {
  try {
    const htmlBody = formatOrderEmailHTML(order);
    const textBody = formatOrderEmailText(order);

    const response = await resend.emails.send({
      from: 'BartKush Orders <onboarding@resend.dev>',
      to: process.env.OWNER_EMAIL,
      subject: `🛍️ New Order Received - #${order.orderId}`,
      html: htmlBody,
      text: textBody
    });

    if (response.error) {
      console.error('❌ Resend error:', response.error.message);
      return { success: false, error: response.error.message };
    }

    console.log(`✅ Email sent for order ${order.orderId}`);
    return { success: true, messageId: response.data?.id };

  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmailNotification };