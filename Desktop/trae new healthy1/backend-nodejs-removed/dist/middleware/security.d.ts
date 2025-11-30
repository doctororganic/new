import { Request } from 'express';
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const strictLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const passwordResetLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const uploadLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const createUserLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const apiKeyLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const createDynamicLimiter: (options: {
    windowMs?: number;
    max?: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    keyGenerator?: (req: Request) => string;
}) => import("express-rate-limit").RateLimitRequestHandler;
declare const _default: {
    apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
    strictLimiter: import("express-rate-limit").RateLimitRequestHandler;
    passwordResetLimiter: import("express-rate-limit").RateLimitRequestHandler;
    uploadLimiter: import("express-rate-limit").RateLimitRequestHandler;
    createUserLimiter: import("express-rate-limit").RateLimitRequestHandler;
    apiKeyLimiter: import("express-rate-limit").RateLimitRequestHandler;
    createDynamicLimiter: (options: {
        windowMs?: number;
        max?: number;
        message?: string;
        skipSuccessfulRequests?: boolean;
        skipFailedRequests?: boolean;
        keyGenerator?: (req: Request) => string;
    }) => import("express-rate-limit").RateLimitRequestHandler;
};
export default _default;
//# sourceMappingURL=security.d.ts.map