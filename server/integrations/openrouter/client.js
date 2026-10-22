const { getChatConfig } = require('../../config/env');
async function chat(message, systemPrompt, { fetchImpl = fetch, config = getChatConfig() } = {}) {
  const response = await fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    signal: AbortSignal.timeout(config.timeout),
    headers: { Authorization: 'Bearer ' + config.apiKey, 'Content-Type': 'application/json', 'HTTP-Referer': config.referer, 'X-Title': 'Pedro Lucas Portfolio' },
    body: JSON.stringify({ model: config.model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }], max_tokens: 500, temperature: 0.7 }),
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error('Chat provider request failed');
  }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) throw new Error('OpenRouter returned an empty response');
  return content.trim();
}
module.exports = { chat };
