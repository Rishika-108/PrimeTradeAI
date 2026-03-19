import { createClient } from 'redis';

let client = null;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: false // Explicitly disable aggressive retries to prevent dev-terminal spam!
      }
    });
    
    // Mute standard verbose disconnected errors to keep the console clean when bypassing caching natively
    client.on('error', () => {}); 
    
    try {
      await client.connect();
      console.log('Connected to Redis Cache Engine');
    } catch (err) {
      console.warn('Redis unavailable natively on port:6379... Application gracefully falling back to raw DB ops.');
    }
  }
  return client;
}

export async function getCachedSignals(key) {
  try {
    const redis = await getRedisClient();
    if (!redis.isOpen) return null;
    
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('Redis get bypassed. Reason:', err.message);
    return null; // Gracefully fail open so the database query still runs
  }
}

export async function setCachedSignals(key, data, expirationInSeconds = 300) {
  try {
    const redis = await getRedisClient();
    if (!redis.isOpen) return;
    
    await redis.setEx(key, expirationInSeconds, JSON.stringify(data));
  } catch (err) {
    console.warn('Redis set sequence bypassed. Reason:', err.message);
  }
}

export async function invalidateCache(keysToInvalidate) {
  try {
    const redis = await getRedisClient();
    if (!redis.isOpen) return;

    if (Array.isArray(keysToInvalidate) && keysToInvalidate.length > 0) {
      await redis.del(keysToInvalidate);
    }
  } catch (err) {
    console.warn('Redis invalidation bypassed. Reason:', err.message);
  }
}
