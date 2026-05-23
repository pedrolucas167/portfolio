// Vercel Serverless Function for chatbot
import { buildSystemPrompt } from '../server/controllers/ChatController.js';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.2-3b-instruct';

function getRefererUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://pedrolucas167.github.io/portfolio/';
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, language = 'pt' } = req.body;
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (!openRouterApiKey) {
      return res.status(500).json({
        success: false,
        message: 'OPENROUTER_API_KEY not configured'
      });
    }

    const systemPrompt = buildSystemPrompt(language);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': getRefererUrl(),
        'X-Title': 'Pedro Lucas Marques Portfolio'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({
      success: true,
      response: content
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate response'
    });
  }
}
