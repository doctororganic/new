"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const security_1 = require("../middleware/security");
const logger_1 = require("../config/logger");
const userService_1 = require("../services/userService");
const router = (0, express_1.Router)();
router.post('/register', security_1.createUserLimiter, [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
], validation_1.validateRequest, (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const fullName = `${firstName} ${lastName}`;
    logger_1.logger.info('User registration attempt', {
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    try {
        const user = await (0, userService_1.createUser)(fullName, email, password);
        const tokens = (0, userService_1.generateTokens)(user);
        logger_1.logger.info('User registered successfully', {
            userId: user.id,
            email: user.email
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                },
                tokens
            }
        });
    }
    catch (error) {
        logger_1.logger.error('User registration failed', {
            email,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Registration failed'
        });
    }
}));
router.post('/login', security_1.strictLimiter, [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
], validation_1.validateRequest, (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    logger_1.logger.info('User login attempt', {
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    try {
        const user = await (0, userService_1.authenticateUser)(email, password);
        const tokens = (0, userService_1.generateTokens)(user);
        logger_1.logger.info('User logged in successfully', {
            userId: user.id,
            email: user.email
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.lastLogin
                },
                tokens
            }
        });
    }
    catch (error) {
        logger_1.logger.error('User login failed', {
            email,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Login failed'
        });
    }
}));
router.post('/logout', auth_1.authenticateToken, (0, errorHandler_1.catchAsync)(async (req, res) => {
    logger_1.logger.info('User logout', {
        userId: req.user?.id,
        ip: req.ip
    });
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
}));
router.post('/refresh', [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
], validation_1.validateRequest, (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { refreshToken } = req.body;
    logger_1.logger.info('Token refresh attempt', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    try {
        const decoded = (0, userService_1.verifyRefreshToken)(refreshToken);
        const user = (0, userService_1.getUserById)(decoded.id);
        const tokens = (0, userService_1.generateTokens)(user);
        logger_1.logger.info('Token refreshed successfully', {
            userId: user.id,
            email: user.email
        });
        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: tokens
        });
    }
    catch (error) {
        logger_1.logger.error('Token refresh failed', {
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Token refresh failed'
        });
    }
}));
router.post('/forgot-password', security_1.passwordResetLimiter, [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
], validation_1.validateRequest, (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    logger_1.logger.info('Password reset request', {
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    res.status(200).json({
        success: true,
        message: 'Password reset email sent'
    });
}));
router.post('/reset-password', [
    (0, express_validator_1.body)('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
], validation_1.validateRequest, (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { token, password } = req.body;
    logger_1.logger.info('Password reset attempt', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    res.status(200).json({
        success: true,
        message: 'Password reset successful'
    });
}));
router.get('/me', auth_1.authenticateToken, (0, errorHandler_1.catchAsync)(async (req, res) => {
    logger_1.logger.debug('Get user profile', {
        userId: req.user?.id,
        ip: req.ip
    });
    try {
        const user = (0, userService_1.getUserById)(req.user.id);
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                }
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get user profile failed', {
            userId: req.user?.id,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : 'User not found'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map