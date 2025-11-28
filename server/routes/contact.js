/**
 * Contact Routes
 * Rotas da API de contato
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ContactController = require('../controllers/ContactController');
const rateLimiter = require('../middleware/rateLimiter');

// Validação dos campos
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  
  body('subject')
    .trim()
    .notEmpty().withMessage('Assunto é obrigatório')
    .isLength({ min: 3, max: 200 }).withMessage('Assunto deve ter entre 3 e 200 caracteres'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Mensagem é obrigatória')
    .isLength({ min: 10, max: 5000 }).withMessage('Mensagem deve ter entre 10 e 5000 caracteres')
];

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// POST /api/contact - Enviar mensagem
router.post(
  '/',
  rateLimiter({ windowMs: 60000, maxRequests: 3 }), // 3 emails por minuto
  contactValidation,
  validate,
  ContactController.sendMessage
);

// GET /api/contact/health - Status do serviço
router.get('/health', ContactController.healthCheck);

module.exports = router;
