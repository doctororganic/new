import { RedisClientType } from 'redis';
declare let redisClient: RedisClientType;
export declare const connectRedis: () => Promise<void>;
export declare const getRedisClient: () => RedisClientType | null;
export declare const checkRedisHealth: () => Promise<boolean>;
declare class CacheService {
    private memoryCache;
    set(key: string, value: any, ttl?: number): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    del(key: string): Promise<void>;
    clear(): Promise<void>;
    exists(key: string): Promise<boolean>;
    setWithPattern(pattern: string, key: string, value: any, ttl?: number): Promise<void>;
    invalidateByPattern(pattern: string): Promise<void>;
}
export declare const cache: CacheService;
export default redisClient;
//# sourceMappingURL=redis.d.ts.map