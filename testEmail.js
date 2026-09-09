// server/testEmail.js
require('dotenv').config({ path: '../.env' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const testEmail = async () => {
  try {
    console.log('📧 Testing email...');
    console.log('📧 From:', process.env.EMAIL_USER);
    console.log('📧 To:', process.env.OWNER_EMAIL);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: '✅ Test Email from BartKush Store',
      text: 'This is a test email to confirm the notification system is working!'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
};

testEmail();