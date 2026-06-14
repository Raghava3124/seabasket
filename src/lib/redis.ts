import Redis from "ioredis";

// Use real Redis if REDIS_URL is provided
const redisClient = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL) 
  : null;

// Mock Redis implementation fallback
const globalForRedis = global as unknown as { mockStore: Map<string, { value: string, expiresAt: number }> };
const mockStore = globalForRedis.mockStore || new Map<string, { value: string, expiresAt: number }>();
if (process.env.NODE_ENV !== "production") globalForRedis.mockStore = mockStore;

export const redis = {
  setex: async (key: string, seconds: number, value: string) => {
    if (redisClient) {
      await redisClient.setex(key, seconds, value);
    } else {
      mockStore.set(key, { value, expiresAt: Date.now() + seconds * 1000 });
    }
  },
  get: async (key: string) => {
    if (redisClient) {
      return await redisClient.get(key);
    }
    const item = mockStore.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      mockStore.delete(key);
      return null;
    }
    return item.value;
  },
  del: async (key: string) => {
    if (redisClient) {
      await redisClient.del(key);
    } else {
      mockStore.delete(key);
    }
  }
};
