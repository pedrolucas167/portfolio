const Contact = require('../models/Contact');
const { transporter } = require('../config/email');

const ContactController = {
  async sendMessage(req, res) {
    try {
      const { name, email, message } = req.body;

      const contact = new Contact(name, email, message);
      const validation = contact.validate();

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: validation.errors
        });
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        replyTo: email,
        subject: `Portfolio - Mensagem de ${name}`,
        html: `
          <h2>Nova mensagem do Portfolio</h2>
          <p><strong>Nome:</strong> ${contact.sanitize(name)}</p>
          <p><strong>Email:</strong> ${contact.sanitize(email)}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${contact.sanitize(message).replace(/\n/g, '<br>')}</p>
          <hr>
          <small>Enviado em: ${new Date().toLocaleString('pt-BR')}</small>
        `
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso!'
      });

    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar mensagem. Tente novamente.'
      });
    }
  },

  async healthCheck(req, res) {
    try {
      await transporter.verify();
      return res.json({ status: 'ok', email: 'connected' });
    } catch {
      return res.status(503).json({ status: 'error', email: 'disconnected' });
    }
  }
};

module.exports = ContactController;
