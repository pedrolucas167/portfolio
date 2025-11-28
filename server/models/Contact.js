class Contact {
  constructor(name, email, message) {
    this.name = name;
    this.email = email;
    this.message = message;
    this.createdAt = new Date();
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Email inválido');
    }

    if (!this.message || this.message.trim().length < 10) {
      errors.push('Mensagem deve ter pelo menos 10 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sanitize(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      message: this.message,
      createdAt: this.createdAt
    };
  }
}

module.exports = Contact;
