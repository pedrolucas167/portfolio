require('dotenv').config({ path: './server/.env' });

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL = 'meta-llama/llama-3.2-3b-instruct';

async function chat(userMessage, systemPrompt) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      signal: AbortSignal.timeout(20000),
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'Pedro Lucas Portfolio'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`OpenRouter request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('OpenRouter returned an empty response');
    }
    return content.trim();
  } catch (error) {
    throw error;
  }
}

module.exports = { chat };
