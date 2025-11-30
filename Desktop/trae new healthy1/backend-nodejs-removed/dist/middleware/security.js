"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamicLimiter = exports.apiKeyLimiter = exports.createUserLimiter = exports.uploadLimiter = exports.passwordResetLimiter = exports.strictLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("../config/logger");
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn('Rate limit exceeded', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent')
        });
        res.status(429).json({
            success: false,
            message: 'Too many requests from this IP, please try again later',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: res.get('Retry-After')
        });
    }
});
exports.strictLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many attempts from this IP, please try again later',
        code: 'STRICT_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        logger_1.logger.warn('Strict rate limit exceeded', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent')
        });
        res.status(429).json({
            success: false,
            message: 'Too many attempts from this IP, please try again later',
            code: 'STRICT_RATE_LIMIT_EXCEEDED',
            retryAfter: res.get('Retry-After')
        });
    }
});
exports.passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: 'Too many password reset attempts, please try again later',
        code: 'PASSWORD_RESET_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.body?.email || req.ip;
    },
    handler: (req, res) => {
        logger_1.logger.warn('Password reset rate limit exceeded', {
            ip: req.ip,
            email: req.body?.email,
            userAgent: req.get('User-Agent')
        });
        res.status(429).json({
            success: false,
            message: 'Too many password reset attempts, please try again later',
            code: 'PASSWORD_RESET_LIMIT_EXCEEDED',
            retryAfter: res.get('Retry-After')
        });
    }
});
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many file uploads from this IP, please try again later',
        code: 'UPLOAD_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn('Upload rate limit exceeded', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent')
        });
        res.status(429).json({
            success: false,
            message: 'Too many file uploads from this IP, please try again later',
            code: 'UPLOAD_LIMIT_EXCEEDED',
            retryAfter: res.get('Retry-After')
        });
    }
});
exports.createUserLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many account creation attempts, please try again later',
        code: 'ACCOUNT_CREATION_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn('Account creation rate limit exceeded', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent')
        });
        res.status(429).json({
            success: false,
            message: 'Too many account creation attempts, please try again later',
            code: 'ACCOUNT_CREATION_LIMIT_EXCEEDED',
            retryAfter: res.get('Retry-After')
        });
    }
});
exports.apiKeyLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    keyGenerator: (req) => {
        return req.headers['x-api-key'] || req.ip;
    },
    message: {
        success: false,
        message: 'API rate limit exceeded, please try again later',
        code: 'API_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn('API rate limit exceeded', {
            ip: req.ip,
            apiKey: req.headers['x-api-key'],
            url: req.url,
            method: req.method
        });
        res.status(429).json({
            success: false,
            message: 'API rate limit exceeded, please try again later',
            code: 'API_RATE_LIMIT_EXCEEDED',
            retryAfter: res.get('Retry-After')
        });
    }
});
const createDynamicLimiter = (options) => {
    return (0, express_rate_limit_1.default)({
        windowMs: options.windowMs || 15 * 60 * 1000,
        max: options.max || 100,
        message: {
            success: false,
            message: options.message || 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED'
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: options.skipSuccessfulRequests || false,
        skipFailedRequests: options.skipFailedRequests || false,
        keyGenerator: options.keyGenerator || ((req) => req.ip),
        handler: (req, res) => {
            logger_1.logger.warn('Dynamic rate limit exceeded', {
                ip: req.ip,
                url: req.url,
                method: req.method,
                userAgent: req.get('User-Agent')
            });
            res.status(429).json({
                success: false,
                message: options.message || 'Rate limit exceeded',
                code: 'RATE_LIMIT_EXCEEDED',
                retryAfter: res.get('Retry-After')
            });
        }
    });
};
exports.createDynamicLimiter = createDynamicLimiter;
exports.default = {
    apiLimiter: exports.apiLimiter,
    strictLimiter: exports.strictLimiter,
    passwordResetLimiter: exports.passwordResetLimiter,
    uploadLimiter: exports.uploadLimiter,
    createUserLimiter: exports.createUserLimiter,
    apiKeyLimiter: exports.apiKeyLimiter,
    createDynamicLimiter: exports.createDynamicLimiter
};
//# sourceMappingURL=security.js.map