/**
 * Contact Controller
 * Controlador responsável pelo envio de emails
 */

const Contact = require('../models/Contact');
const { transporter } = require('../config/email');

const ContactController = {
  /**
   * POST /api/contact
   * Enviar mensagem de contato
   */
  async sendMessage(req, res) {
    try {
      // Criar instância do modelo Contact
      const contact = new Contact({
        ...req.body,
        ip: req.ip || req.connection.remoteAddress
      });

      // Validar dados
      const validation = contact.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: validation.errors
        });
      }

      // Preparar email
      const emailData = contact.toEmailFormat();

      // Configurar opções do email
      const mailOptions = {
        from: `"Portfolio - ${contact.name}" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || 'pedro_marques_dev@hotmail.com',
        replyTo: contact.email,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      };

      // Enviar email
      await transporter.sendMail(mailOptions);

      // Log de sucesso
      console.log(`✓ Email enviado de ${contact.email} - ${contact.subject}`);

      // Responder sucesso
      return res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso! Entrarei em contato em breve.'
      });

    } catch (error) {
      console.error('✗ Erro ao enviar email:', error);

      // Em desenvolvimento, retorna erro detalhado
      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar mensagem',
          error: error.message
        });
      }

      // Em produção, mensagem genérica
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar mensagem. Tente novamente mais tarde.'
      });
    }
  },

  /**
   * GET /api/contact/health
   * Verificar status do serviço de email
   */
  async healthCheck(req, res) {
    try {
      await transporter.verify();
      return res.status(200).json({
        success: true,
        message: 'Serviço de email funcionando',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(503).json({
        success: false,
        message: 'Serviço de email indisponível'
      });
    }
  }
};

module.exports = ContactController;
