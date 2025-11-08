import { redisClient } from '../config/redis.js';

// Helper functions
export const redisUtils = {
  // Set with expiration
  async setEx(key: string, value: string, ttl: number): Promise<void> {
    const client = redisClient.getClient();
    await client.setEx(key, ttl, value);
  },

  // Get value
  async get(key: string): Promise<string | null> {
    const client = redisClient.getClient();
    return await client.get(key);
  },

  // Delete key
  async del(key: string): Promise<number> {
    const client = redisClient.getClient();
    return await client.del(key);
  },

  // Set JSON
  async setJSON(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.setEx(key, stringValue, ttl);
    } else {
      const client = redisClient.getClient();
      await client.set(key, stringValue);
    }
  },

  // Get JSON
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error parsing JSON from Redis:', error);
      return null;
    }
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    const client = redisClient.getClient();
    const result = await client.exists(key);
    return result === 1;
  },

  // Increment counter
  async incr(key: string): Promise<number> {
    const client = redisClient.getClient();
    return await client.incr(key);
  },

  // Set expiration
  async expire(key: string, seconds: number): Promise<number> {
    const client = redisClient.getClient();
    return await client.expire(key, seconds);
  },

  // Get TTL
  async ttl(key: string): Promise<number> {
    const client = redisClient.getClient();
    return await client.ttl(key);
  },

  // Delete keys by pattern
  async deleteByPattern(pattern: string): Promise<number> {
    const client = redisClient.getClient();
    const keys = await client.keys(pattern);
    if (keys.length === 0) return 0;
    return await client.del(keys);
  },
};
