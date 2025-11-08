import type { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service.js';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

export const redisRateLimiter = (config: RateLimitConfig) => {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
  } = config;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = req.ip || req.socket.remoteAddress || 'unknown';
      const key = `${req.path}:${identifier}`;

      const count = await cacheService.incrementRateLimit(key, windowMs);

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count));
      res.setHeader('X-RateLimit-Reset', Date.now() + windowMs);

      if (count > max) {
        return res.status(429).json({
          success: false,
          message,
          retryAfter: windowMs / 1000,
        });
      }

      if (skipSuccessfulRequests) {
        const originalJson = res.json.bind(res);
        res.json = function (data: any) {
          if (res.statusCode < 400) {
            cacheService.getRateLimitCount(key).then((currentCount) => {
              if (currentCount > 0) {
                // Custom logic if needed
              }
            });
          }
          return originalJson(data);
        };
      }

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      next();
    }
  };
};

export const apiRateLimiter = redisRateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
});

export const authRateLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),
  message: 'Too many authentication attempts, please try again after 15 minutes.',
  skipSuccessfulRequests: true,
});
