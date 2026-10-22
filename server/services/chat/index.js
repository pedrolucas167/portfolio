const provider = require('../../integrations/openrouter/client');
const { buildSystemPrompt, normalizeLanguage } = require('./prompt');
class ChatInputError extends Error {}
async function generateReply(body, { chat = provider.chat } = {}) {
  const { message, language } = body ?? {};
  if (typeof message !== 'string' || !message.trim() || message.length > 4000) throw new ChatInputError('Message must contain between 1 and 4000 characters');
  return chat(message.trim(), buildSystemPrompt(normalizeLanguage(language)));
}
module.exports = { generateReply, ChatInputError };
