/**
 * Email Configuration
 * Configuração do transportador de email usando Nodemailer
 */

const nodemailer = require('nodemailer');

// Configuração do transportador
// Para produção, use suas credenciais SMTP reais
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER || 'seu-email@hotmail.com',
    pass: process.env.SMTP_PASS || 'sua-senha-de-app',
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});

// Verificar conexão
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('✓ Servidor de email conectado');
    return true;
  } catch (error) {
    console.error('✗ Erro na conexão com servidor de email:', error.message);
    return false;
  }
};

module.exports = { transporter, verifyConnection };
