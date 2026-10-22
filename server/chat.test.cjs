const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { chat } = require('./config/openai');
const { generateChatResponse } = require('./controllers/ChatController');
const { buildSystemPrompt } = require('./services/chat/prompt');
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

const portfolio = require('../shared/portfolio/content.json');
const { generateReply } = require('./services/chat');
const { createRateLimiter } = require('./middleware/rateLimiter');

test('prompt and website use the same portfolio source', () => {
  const prompt = buildSystemPrompt('en');
  assert.ok(prompt.includes(portfolio.personalInfo.name));
  assert.ok(prompt.includes(portfolio.personalInfo.email));
  for (const project of portfolio.projects) {
    if (project.github) assert.ok(prompt.includes(project.github));
    if (project.demo) assert.ok(prompt.includes(project.demo));
  }
  assert.ok(!prompt.includes('project_novamesh_title'));
});

test('chat business logic can run without HTTP or a real provider', async () => {
  let called = false;
  const reply = await generateReply({ message: ' hello ', language: 'es-MX' }, {
    chat: async (message, prompt) => {
      called = true;
      assert.equal(message, 'hello');
      assert.ok(prompt.endsWith('Siempre responde en español.'));
      return 'Hola';
    },
  });
  assert.equal(called, true);
  assert.equal(reply, 'Hola');
});

test('rate limits reject excess requests, expire and remain bounded', () => {
  let time = 0;
  const store = new Map();
  const limiter = createRateLimiter({ max: 2, windowMs: 1000, maxKeys: 1, store, now: () => time });
  const req = { ip: 'client' };
  const res = response();
  res.setHeader = () => {};
  let accepted = 0;
  const next = () => accepted++;
  limiter(req, res, next);
  limiter(req, res, next);
  for (let i = 0; i < 10; i++) limiter(req, res, next);
  assert.equal(accepted, 2);
  assert.equal(res.statusCode, 429);
  assert.equal(store.get('client').count, 2);
  limiter({ ip: 'another' }, res, next);
  assert.equal(store.size, 1);
  time = 1001;
  limiter({ ip: 'another' }, res, next);
  assert.equal(accepted, 3);
  assert.equal(store.has('client'), false);
});

test('Express app imports without opening a port and serves production fallback', async () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const app = require('./app');
    assert.equal(typeof app, 'function');
    const server = app.listen(0, '127.0.0.1');
    try {
      await new Promise(resolve => server.once('listening', resolve));
      const response = await originalFetch('http://127.0.0.1:' + server.address().port + '/api/health');
      assert.equal(response.status, 200);
      assert.equal((await response.json()).status, 'online');
      const page = await originalFetch('http://127.0.0.1:' + server.address().port + '/portfolio-route');
      assert.equal(page.status, 200);
      assert.ok((await page.text()).includes('<html'));
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  } finally {
    if (originalEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalEnv;
  }
});
