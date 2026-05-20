const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../controllers/ChatController');
const rateLimiter = require('../middleware/rateLimiter');

// Apply rate limiting to prevent abuse
router.use(rateLimiter);

router.post('/', generateChatResponse);

module.exports = router;
