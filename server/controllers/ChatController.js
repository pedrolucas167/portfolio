const { generateReply, ChatInputError } = require('../services/chat');
function chatError(error) {
  const status = error instanceof ChatInputError ? 400 : error.name === 'TimeoutError' ? 504 : 502;
  if (status !== 400) console.error('Chat request failed:', error.name);
  return { status, body: { success: false, message: status === 400 ? error.message : 'Failed to generate response' } };
}
async function generateChatResponse(req, res) {
  try {
    return res.json({ success: true, response: await generateReply(req.body) });
  } catch (error) {
    const { status, body } = chatError(error);
    return res.status(status).json(body);
  }
}
module.exports = { generateChatResponse, chatError };
