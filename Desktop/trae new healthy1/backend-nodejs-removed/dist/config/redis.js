"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.checkRedisHealth = exports.getRedisClient = exports.connectRedis = void 0;
const redis_1 = require("redis");
const logger_1 = require("./logger");
const logger = (0, logger_1.createLogger)('redis');
let redisClient;
const redisConfig = {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                logger.error('Redis reconnection failed after 10 attempts');
                return new Error('Redis reconnection failed');
            }
            return Math.min(retries * 50, 500);
        },
    },
};
const connectRedis = async () => {
    try {
        redisClient = (0, redis_1.createClient)(redisConfig);
        redisClient.on('error', (error) => {
            logger.error('Redis client error:', error);
        });
        redisClient.on('connect', () => {
            logger.info('Redis client connected');
        });
        redisClient.on('ready', () => {
            logger.info('Redis client ready');
        });
        redisClient.on('end', () => {
            logger.info('Redis client disconnected');
        });
        await redisClient.connect();
        logger.info('Redis connected successfully');
    }
    catch (error) {
        logger.error('Redis connection failed:', error);
        logger.warn('Application will continue without Redis caching');
    }
};
exports.connectRedis = connectRedis;
const getRedisClient = () => {
    return redisClient || null;
};
exports.getRedisClient = getRedisClient;
const checkRedisHealth = async () => {
    try {
        if (!redisClient)
            return false;
        await redisClient.ping();
        return true;
    }
    catch (error) {
        logger.error('Redis health check failed:', error);
        return false;
    }
};
exports.checkRedisHealth = checkRedisHealth;
class CacheService {
    constructor() {
        this.memoryCache = new Map();
    }
    async set(key, value, ttl = 3600) {
        try {
            if (redisClient?.isOpen) {
                await redisClient.setEx(key, ttl, JSON.stringify(value));
            }
            else {
                const expiry = Date.now() + ttl * 1000;
                this.memoryCache.set(key, { data: value, expiry });
            }
        }
        catch (error) {
            logger.error('Cache set error:', error);
            const expiry = Date.now() + ttl * 1000;
            this.memoryCache.set(key, { data: value, expiry });
        }
    }
    async get(key) {
        try {
            if (redisClient?.isOpen) {
                const value = await redisClient.get(key);
                return value ? JSON.parse(value) : null;
            }
            else {
                const cached = this.memoryCache.get(key);
                if (!cached)
                    return null;
                if (Date.now() > cached.expiry) {
                    this.memoryCache.delete(key);
                    return null;
                }
                return cached.data;
            }
        }
        catch (error) {
            logger.error('Cache get error:', error);
            return null;
        }
    }
    async del(key) {
        try {
            if (redisClient?.isOpen) {
                await redisClient.del(key);
            }
            else {
                this.memoryCache.delete(key);
            }
        }
        catch (error) {
            logger.error('Cache delete error:', error);
        }
    }
    async clear() {
        try {
            if (redisClient?.isOpen) {
                await redisClient.flushAll();
            }
            else {
                this.memoryCache.clear();
            }
        }
        catch (error) {
            logger.error('Cache clear error:', error);
        }
    }
    async exists(key) {
        try {
            if (redisClient?.isOpen) {
                return (await redisClient.exists(key)) === 1;
            }
            else {
                const cached = this.memoryCache.get(key);
                if (!cached)
                    return false;
                if (Date.now() > cached.expiry) {
                    this.memoryCache.delete(key);
                    return false;
                }
                return true;
            }
        }
        catch (error) {
            logger.error('Cache exists error:', error);
            return false;
        }
    }
    async setWithPattern(pattern, key, value, ttl = 3600) {
        try {
            await this.set(key, value, ttl);
            if (redisClient?.isOpen) {
                await redisClient.sAdd(`pattern:${pattern}`, key);
                await redisClient.expire(`pattern:${pattern}`, ttl);
            }
        }
        catch (error) {
            logger.error('Cache set with pattern error:', error);
        }
    }
    async invalidateByPattern(pattern) {
        try {
            if (redisClient?.isOpen) {
                const keys = await redisClient.sMembers(`pattern:${pattern}`);
                if (keys.length > 0) {
                    await redisClient.del(...keys);
                    await redisClient.del(`pattern:${pattern}`);
                }
            }
        }
        catch (error) {
            logger.error('Cache invalidate by pattern error:', error);
        }
    }
}
exports.cache = new CacheService();
process.on('beforeExit', async () => {
    if (redisClient?.isOpen) {
        logger.info('Closing Redis connection...');
        await redisClient.quit();
        logger.info('Redis connection closed.');
    }
});
exports.default = redisClient;
//# sourceMappingURL=redis.js.map