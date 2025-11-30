"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required',
                code: 'TOKEN_REQUIRED'
            });
            return;
        }
        jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET, (err, decoded) => {
            if (err) {
                logger_1.logger.warn(`Invalid token attempt: ${err.message}`, {
                    ip: req.ip,
                    userAgent: req.get('User-Agent')
                });
                res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token',
                    code: 'TOKEN_INVALID'
                });
                return;
            }
            const payload = decoded;
            req.user = {
                id: payload.id,
                email: payload.email,
                role: payload.role
            };
            logger_1.logger.debug('User authenticated successfully', {
                userId: payload.id,
                email: payload.email,
                role: payload.role
            });
            next();
        });
    }
    catch (error) {
        logger_1.logger.error('Authentication middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error',
            code: 'AUTH_ERROR'
        });
    }
};
exports.authenticateToken = authenticateToken;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'AUTH_REQUIRED'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            logger_1.logger.warn('Unauthorized access attempt', {
                userId: req.user.id,
                userRole: req.user.role,
                requiredRoles: roles,
                ip: req.ip,
                path: req.path
            });
            res.status(403).json({
                success: false,
                message: 'Insufficient permissions',
                code: 'INSUFFICIENT_PERMISSIONS'
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET, (err, decoded) => {
                if (!err) {
                    const payload = decoded;
                    req.user = {
                        id: payload.id,
                        email: payload.email,
                        role: payload.role
                    };
                }
            });
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map