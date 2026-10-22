function getChatConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('Chat provider is not configured');
  return {
    apiKey,
    model: 'meta-llama/llama-3.2-3b-instruct',
    referer: process.env.SITE_URL || process.env.FRONTEND_URL || (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'),
    timeout: 20000,
  };
}
module.exports = { getChatConfig };
