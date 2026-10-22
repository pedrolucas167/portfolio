import chatService from '../server/services/chat/index.js';
import controller from '../server/controllers/ChatController.js';
import rateLimiter from '../server/middleware/rateLimiter.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  return rateLimiter(req, res, async () => {
    try {
      return res.json({ success: true, response: await chatService.generateReply(req.body) });
    } catch (error) {
      const { status, body } = controller.chatError(error);
      return res.status(status).json(body);
    }
  });
}
