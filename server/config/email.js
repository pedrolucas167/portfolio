const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-mail.outlook.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('📧 Email service ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    return false;
  }
};

module.exports = { transporter, verifyConnection };
