/**
 * Rate Limiter Middleware
 * Previne spam e abuso da API
 */

const rateLimit = new Map();

const rateLimiter = (options = {}) => {
  const {
    windowMs = 60 * 1000, // 1 minuto
    maxRequests = 5,       // 5 requisições por minuto
    message = 'Muitas tentativas. Aguarde um momento antes de tentar novamente.'
  } = options;

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // Limpar entradas antigas
    if (rateLimit.has(ip)) {
      const userData = rateLimit.get(ip);
      if (now - userData.firstRequest > windowMs) {
        rateLimit.delete(ip);
      }
    }

    // Verificar rate limit
    if (rateLimit.has(ip)) {
      const userData = rateLimit.get(ip);
      userData.count++;

      if (userData.count > maxRequests) {
        const timeLeft = Math.ceil((userData.firstRequest + windowMs - now) / 1000);
        return res.status(429).json({
          success: false,
          message,
          retryAfter: timeLeft
        });
      }
    } else {
      rateLimit.set(ip, {
        count: 1,
        firstRequest: now
      });
    }

    next();
  };
};

module.exports = rateLimiter;
