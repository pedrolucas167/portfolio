const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/', rateLimiter, ContactController.sendMessage);
router.get('/health', ContactController.healthCheck);

module.exports = router;
