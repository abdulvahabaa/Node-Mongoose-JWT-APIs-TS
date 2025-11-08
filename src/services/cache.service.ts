import { redisUtils } from '../config/redis.js';

export class CacheService {
  private defaultTTL: number;

  constructor(defaultTTL = 3600) {
    this.defaultTTL = defaultTTL;
  }

  async cacheUser(userId: string, userData: any, ttl?: number): Promise<void> {
    const key = `user:${userId}`;
    await redisUtils.setJSON(key, userData, ttl || this.defaultTTL);
  }

  async getCachedUser(userId: string): Promise<any | null> {
    const key = `user:${userId}`;
    return await redisUtils.getJSON(key);
  }

  async invalidateUser(userId: string): Promise<void> {
    const key = `user:${userId}`;
    await redisUtils.del(key);
  }

  async cacheQuery(queryKey: string, data: any, ttl?: number): Promise<void> {
    const key = `query:${queryKey}`;
    await redisUtils.setJSON(key, data, ttl || this.defaultTTL);
  }

  async getCachedQuery<T>(queryKey: string): Promise<T | null> {
    const key = `query:${queryKey}`;
    return await redisUtils.getJSON<T>(key);
  }

  async createSession(sessionId: string, userId: string, ttl = 86400): Promise<void> {
    const key = `session:${sessionId}`;
    await redisUtils.setJSON(key, { userId, createdAt: Date.now() }, ttl);
  }

  async getSession(sessionId: string): Promise<{ userId: string; createdAt: number } | null> {
    const key = `session:${sessionId}`;
    return await redisUtils.getJSON(key);
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await redisUtils.del(key);
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    await redisUtils.deleteByPattern(`session:*:${userId}`);
  }

  async incrementRateLimit(identifier: string, windowMs: number): Promise<number> {
    const key = `ratelimit:${identifier}`;
    const count = await redisUtils.incr(key);

    if (count === 1) {
      await redisUtils.expire(key, Math.ceil(windowMs / 1000));
    }

    return count;
  }

  async getRateLimitCount(identifier: string): Promise<number> {
    const key = `ratelimit:${identifier}`;
    const value = await redisUtils.get(key);
    return value ? parseInt(value) : 0;
  }

  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    const key = `blacklist:${token}`;
    await redisUtils.setEx(key, '1', expiresIn);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    return await redisUtils.exists(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await redisUtils.setJSON(key, value, ttl || this.defaultTTL);
  }

  async get<T>(key: string): Promise<T | null> {
    return await redisUtils.getJSON<T>(key);
  }

  async delete(key: string): Promise<void> {
    await redisUtils.del(key);
  }

  async deleteByPattern(pattern: string): Promise<number> {
    return await redisUtils.deleteByPattern(pattern);
  }

  async exists(key: string): Promise<boolean> {
    return await redisUtils.exists(key);
  }

  async warmCache(key: string, fetchFn: () => Promise<any>, ttl?: number): Promise<any> {
    const cached = await this.get(key);
    if (cached) return cached;

    const data = await fetchFn();
    await this.set(key, data, ttl);
    return data;
  }
}

export const cacheService = new CacheService(parseInt(process.env.REDIS_TTL || '3600'));
