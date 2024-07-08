import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.log('Redis client error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('ready', () => {
      console.log('Redis client is ready');
    });

    this.client.on('end', () => {
      console.log('Redis client disconnected');
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return promisify(this.client.get).bind(this.client)(key);
  }

  async set(key, value, duration) {
    await promisify(this.client.set).bind(this.client)(key, value);
    await promisify(this.client.expire).bind(this.client)(key, duration);
  }

  async del(key) {
    await promisify(this.client.del).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
