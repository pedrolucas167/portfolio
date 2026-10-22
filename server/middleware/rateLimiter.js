// The default store is bounded and process-local, including in serverless instances.
// Multi-instance deployments need a distributed limiter instead of this memory store.
function createRateLimiter({ max = 5, windowMs = 15 * 60 * 1000, now = Date.now, store = new Map(), maxKeys = 10000 } = {}) {
  return (req, res, next) => {
    const time = now();
    const key = req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress || 'anonymous';
    // Expire inactive keys without an import-time interval.
    for (const [ip, entry] of store) if (entry.expiresAt <= time) store.delete(ip);
    let entry = store.get(key);
    if (!entry && store.size >= maxKeys) {
      res.setHeader('Retry-After', String(Math.ceil(windowMs / 1000)));
      return res.status(429).json({ success: false, message: 'Muitas requisições. Tente novamente em alguns minutos.' });
    }
    if (!entry) { entry = { count: 0, expiresAt: time + windowMs }; store.set(key, entry); }
    if (entry.count >= max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.expiresAt - time) / 1000)));
      return res.status(429).json({ success: false, message: 'Muitas requisições. Tente novamente em alguns minutos.' });
    }
    entry.count++;
    return next();
  };
}
module.exports = createRateLimiter();
module.exports.createRateLimiter = createRateLimiter;
