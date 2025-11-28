/**
 * Contact Model
 * Modelo para validação e estrutura dos dados de contato
 */

class Contact {
  constructor(data) {
    this.name = data.name?.trim() || '';
    this.email = data.email?.trim().toLowerCase() || '';
    this.subject = data.subject?.trim() || '';
    this.message = data.message?.trim() || '';
    this.createdAt = new Date();
    this.ip = data.ip || '';
  }

  // Validar dados do contato
  validate() {
    const errors = [];

    if (!this.name || this.name.length < 2) {
      errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres' });
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push({ field: 'email', message: 'E-mail inválido' });
    }

    if (!this.subject || this.subject.length < 3) {
      errors.push({ field: 'subject', message: 'Assunto deve ter pelo menos 3 caracteres' });
    }

    if (!this.message || this.message.length < 10) {
      errors.push({ field: 'message', message: 'Mensagem deve ter pelo menos 10 caracteres' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar formato de email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Formatar para envio de email
  toEmailFormat() {
    return {
      subject: `[Portfolio] ${this.subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #06b6d4); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📬 Nova Mensagem do Portfolio</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #64748b;">Nome:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">
                  ${this.name}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #64748b;">E-mail:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <a href="mailto:${this.email}" style="color: #3b82f6;">${this.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #64748b;">Assunto:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">
                  ${this.subject}
                </td>
              </tr>
            </table>
            
            <div style="margin-top: 24px;">
              <strong style="color: #64748b; display: block; margin-bottom: 12px;">Mensagem:</strong>
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; color: #1e293b; line-height: 1.6;">
                ${this.message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="background: #1e293b; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 14px;">
              Enviado em ${this.createdAt.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      `,
      text: `
Nova mensagem do Portfolio

Nome: ${this.name}
E-mail: ${this.email}
Assunto: ${this.subject}

Mensagem:
${this.message}

---
Enviado em ${this.createdAt.toLocaleString('pt-BR')}
      `
    };
  }

  // Converter para JSON
  toJSON() {
    return {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      createdAt: this.createdAt.toISOString()
    };
  }
}

module.exports = Contact;
