const rateLimit = new Map();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }

  const requests = rateLimit.get(ip).filter(time => time > windowStart);
  requests.push(now);
  rateLimit.set(ip, requests);

  if (requests.length > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Muitas requisições. Tente novamente em alguns minutos.'
    });
  }

  next();
};

setInterval(() => {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  for (const [ip, requests] of rateLimit.entries()) {
    const valid = requests.filter(time => time > windowStart);
    if (valid.length === 0) {
      rateLimit.delete(ip);
    } else {
      rateLimit.set(ip, valid);
    }
  }
}, WINDOW_MS);

module.exports = rateLimiter;
