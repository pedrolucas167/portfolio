const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { chat } = require('./config/openai');
const { generateChatResponse, buildSystemPrompt } = require('./controllers/ChatController');
const originalFetch = global.fetch;
const originalKey = process.env.OPENROUTER_API_KEY;
afterEach(() => {
  global.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
  else process.env.OPENROUTER_API_KEY = originalKey;
});

function response() {
  return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}

test('rejects missing, non-string, whitespace and oversized input before contacting AI', async () => {
  global.fetch = () => { throw new Error('Provider must not be called'); };
  for (const body of [undefined, null, {}, { message: 123 }, { message: '   ' }, { message: 'x'.repeat(4001) }]) {
    const res = response();
    await generateChatResponse({ body }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
  }
});

test('normalizes regional languages and safely falls back for unknown values', () => {
  assert.ok(buildSystemPrompt('en-US').endsWith('Always respond in English.'));
  for (const language of ['constructor', '__proto__', null, {}]) {
    assert.ok(buildSystemPrompt(language).endsWith('Responda sempre em português.'));
  }
});

test('sends validated messages with a bounded provider request', async () => {
  process.env.OPENROUTER_API_KEY = 'test-key';
  global.fetch = async (_url, options) => {
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(JSON.parse(options.body).messages[1].content, 'hello');
    return { ok: true, json: async () => ({ choices: [{ message: { content: ' Hi! ' } }] }) };
  };
  const res = response();
  await generateChatResponse({ body: { message: ' hello ', language: 'en-US' } }, res);
  assert.deepEqual(res.body, { success: true, response: 'Hi!' });
});

test('rejects missing or empty provider content instead of reporting success', async () => {
  process.env.OPENROUTER_API_KEY = 'test-key';
  for (const data of [{}, { choices: [] }, { choices: [{ message: { content: ' ' } }] }]) {
    global.fetch = async () => ({ ok: true, json: async () => data });
    await assert.rejects(chat('hello', 'prompt'), /empty response/);
  }
});

test('maps provider timeouts to gateway timeout without leaking provider details', async () => {
  process.env.OPENROUTER_API_KEY = 'test-key';
  global.fetch = async () => { throw new DOMException('private provider detail', 'TimeoutError'); };
  const res = response();
  await generateChatResponse({ body: { message: 'hello' } }, res);
  assert.equal(res.statusCode, 504);
  assert.equal(res.body.success, false);
  assert.ok(!res.body.message.includes('private'));
});

test('Vercel handler shares input validation and rejects unsupported methods', async () => {
  const { default: handler } = await import('../api/chat.js');
  const res = response();
  res.setHeader = () => {};
  await handler({ method: 'POST', body: { message: {} } }, res);
  assert.equal(res.statusCode, 400);
  await handler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 405);
});
