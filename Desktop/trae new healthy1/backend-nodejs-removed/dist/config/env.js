"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackendUrl = exports.getFrontendUrl = exports.isTest = exports.isProduction = exports.isDevelopment = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const validateEnv = () => {
    const required = [
        'DATABASE_URL',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'SESSION_SECRET',
    ];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};
const parseEnv = () => {
    validateEnv();
    return {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: parseInt(process.env.PORT || '3001', 10),
        API_VERSION: process.env.API_VERSION || 'v1',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
        CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
        RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
        MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
        ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
        SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
        SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
        SMTP_USER: process.env.SMTP_USER || '',
        SMTP_PASS: process.env.SMTP_PASS || '',
        FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@nutritrack.com',
        FROM_NAME: process.env.FROM_NAME || 'NutriTrack',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        LOG_FILE: process.env.LOG_FILE || 'logs',
        LOG_MAX_SIZE: process.env.LOG_MAX_SIZE || '20m',
        LOG_MAX_FILES: process.env.LOG_MAX_FILES || '14d',
        BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
        SESSION_SECRET: process.env.SESSION_SECRET,
        API_DOCS_ENABLED: process.env.API_DOCS_ENABLED === 'true',
        API_DOCS_PATH: process.env.API_DOCS_PATH || '/api-docs',
        HEALTH_CHECK_ENABLED: process.env.HEALTH_CHECK_ENABLED === 'true',
        METRICS_ENABLED: process.env.METRICS_ENABLED === 'true',
        DEBUG: process.env.DEBUG === 'true',
    };
};
exports.config = parseEnv();
const isDevelopment = () => exports.config.NODE_ENV === 'development';
exports.isDevelopment = isDevelopment;
const isProduction = () => exports.config.NODE_ENV === 'production';
exports.isProduction = isProduction;
const isTest = () => exports.config.NODE_ENV === 'test';
exports.isTest = isTest;
const getFrontendUrl = () => {
    return exports.config.CORS_ORIGIN;
};
exports.getFrontendUrl = getFrontendUrl;
const getBackendUrl = () => {
    const protocol = exports.config.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.HOST || 'localhost';
    return `${protocol}://${host}:${exports.config.PORT}`;
};
exports.getBackendUrl = getBackendUrl;
exports.default = exports.config;
//# sourceMappingURL=env.js.map