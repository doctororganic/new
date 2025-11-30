"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonSchemas = exports.validateRequestSize = exports.validateContentType = exports.validateRateLimit = exports.sanitizeInput = exports.validateWithJoi = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("../config/logger");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: error.type === 'field' ? error.value : undefined
        }));
        logger_1.logger.warn('Validation failed', {
            url: req.url,
            method: req.method,
            errors: formattedErrors,
            body: req.body,
            params: req.params,
            query: req.query
        });
        const error = new errorHandler_1.AppError('Validation failed', 400, 'VALIDATION_ERROR');
        error.message = JSON.stringify(formattedErrors);
        return next(error);
    }
    next();
};
exports.validateRequest = validateRequest;
const validateWithJoi = (schema, target = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[target], {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });
        if (error) {
            const formattedErrors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));
            logger_1.logger.warn('Joi validation failed', {
                url: req.url,
                method: req.method,
                target,
                errors: formattedErrors,
                input: req[target]
            });
            const validationError = new errorHandler_1.AppError('Validation failed', 400, 'VALIDATION_ERROR');
            validationError.message = JSON.stringify(formattedErrors);
            return next(validationError);
        }
        req[target] = value;
        next();
    };
};
exports.validateWithJoi = validateWithJoi;
const sanitizeInput = (req, res, next) => {
    const sanitizeString = (str) => {
        if (typeof str !== 'string')
            return str;
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
    };
    const sanitizeObject = (obj) => {
        if (obj === null || obj === undefined)
            return obj;
        if (typeof obj === 'string') {
            return sanitizeString(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }
        if (typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = sanitizeObject(value);
            }
            return sanitized;
        }
        return obj;
    };
    req.body = sanitizeObject(req.body);
    req.params = sanitizeObject(req.params);
    req.query = sanitizeObject(req.query);
    next();
};
exports.sanitizeInput = sanitizeInput;
const validateRateLimit = (req, res, next) => {
    const rateLimitHeaders = {
        'X-RateLimit-Limit': req.get('X-RateLimit-Limit'),
        'X-RateLimit-Remaining': req.get('X-RateLimit-Remaining'),
        'X-RateLimit-Reset': req.get('X-RateLimit-Reset')
    };
    if (rateLimitHeaders['X-RateLimit-Limit']) {
        logger_1.logger.debug('Rate limit info', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            rateLimitHeaders
        });
    }
    next();
};
exports.validateRateLimit = validateRateLimit;
const validateContentType = (allowedTypes) => {
    return (req, res, next) => {
        if (req.method === 'GET' || req.method === 'DELETE') {
            return next();
        }
        const contentType = req.get('Content-Type');
        if (!contentType) {
            const error = new errorHandler_1.AppError('Content-Type header is required', 400, 'MISSING_CONTENT_TYPE');
            return next(error);
        }
        const isAllowed = allowedTypes.some(type => contentType.toLowerCase().includes(type.toLowerCase()));
        if (!isAllowed) {
            const error = new errorHandler_1.AppError(`Content-Type ${contentType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`, 415, 'UNSUPPORTED_MEDIA_TYPE');
            return next(error);
        }
        next();
    };
};
exports.validateContentType = validateContentType;
const validateRequestSize = (maxSize) => {
    return (req, res, next) => {
        const contentLength = parseInt(req.get('Content-Length') || '0');
        if (contentLength > maxSize) {
            const error = new errorHandler_1.AppError(`Request size ${contentLength} exceeds maximum allowed size ${maxSize}`, 413, 'PAYLOAD_TOO_LARGE');
            return next(error);
        }
        next();
    };
};
exports.validateRequestSize = validateRequestSize;
exports.commonSchemas = {
    objectId: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(8).max(128).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'any.required': 'Password is required'
    }),
    pagination: joi_1.default.object({
        page: joi_1.default.number().integer().min(1).default(1),
        limit: joi_1.default.number().integer().min(1).max(100).default(10),
        sort: joi_1.default.string().optional(),
        order: joi_1.default.string().valid('asc', 'desc').default('desc')
    }),
    dateRange: joi_1.default.object({
        startDate: joi_1.default.date().iso().optional(),
        endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')).optional()
    })
};
exports.default = {
    validateRequest: exports.validateRequest,
    validateWithJoi: exports.validateWithJoi,
    sanitizeInput: exports.sanitizeInput,
    validateRateLimit: exports.validateRateLimit,
    validateContentType: exports.validateContentType,
    validateRequestSize: exports.validateRequestSize,
    commonSchemas: exports.commonSchemas
};
//# sourceMappingURL=validation.js.map