"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUncaughtExceptions = exports.handleUnhandledRejections = exports.notFoundHandler = exports.catchAsync = exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../config/logger");
class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
    let err = error;
    if (!err.isOperational) {
        err.statusCode = 500;
        err.message = 'Something went wrong';
    }
    logger_1.logger.error('Error occurred:', {
        message: err.message,
        statusCode: err.statusCode,
        code: err.code,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.body,
        params: req.params,
        query: req.query
    });
    if (error.name === 'ValidationError') {
        handleValidationError(error, req, res);
    }
    else if (error.name === 'CastError') {
        handleCastError(error, req, res);
    }
    else if (error.code === 11000) {
        handleDuplicateFieldsError(error, req, res);
    }
    else if (error.name === 'JsonWebTokenError') {
        handleJWTError(error, req, res);
    }
    else if (error.name === 'TokenExpiredError') {
        handleJWTExpiredError(error, req, res);
    }
    else {
        sendErrorResponse(err, req, res);
    }
};
exports.errorHandler = errorHandler;
const handleValidationError = (error, req, res) => {
    const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value
    }));
    const response = {
        success: false,
        message: 'Validation Error',
        code: 'VALIDATION_ERROR',
        errors
    };
    res.status(400).json(response);
};
const handleCastError = (error, req, res) => {
    const response = {
        success: false,
        message: `Invalid ${error.path}: ${error.value}`,
        code: 'INVALID_ID'
    };
    res.status(400).json(response);
};
const handleDuplicateFieldsError = (error, req, res) => {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    const response = {
        success: false,
        message: `Duplicate field value: ${field} with value: ${value}`,
        code: 'DUPLICATE_FIELD'
    };
    res.status(400).json(response);
};
const handleJWTError = (error, req, res) => {
    const response = {
        success: false,
        message: 'Invalid token. Please log in again',
        code: 'INVALID_TOKEN'
    };
    res.status(401).json(response);
};
const handleJWTExpiredError = (error, req, res) => {
    const response = {
        success: false,
        message: 'Your token has expired. Please log in again',
        code: 'TOKEN_EXPIRED'
    };
    res.status(401).json(response);
};
const sendErrorResponse = (err, req, res) => {
    const response = {
        success: false,
        message: err.message,
        code: err.code
    };
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    if (err.message.includes('validation') && err.stack) {
        try {
            const parsedErrors = JSON.parse(err.message);
            response.errors = parsedErrors;
        }
        catch {
        }
    }
    res.status(err.statusCode).json(response);
};
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
const notFoundHandler = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const handleUnhandledRejections = () => {
    process.on('unhandledRejection', (reason, promise) => {
        logger_1.logger.error('Unhandled Promise Rejection:', {
            reason: reason.message,
            stack: reason.stack,
            promise
        });
        logger_1.logger.info('Shutting down due to unhandled promise rejection...');
        process.exit(1);
    });
};
exports.handleUnhandledRejections = handleUnhandledRejections;
const handleUncaughtExceptions = () => {
    process.on('uncaughtException', (error) => {
        logger_1.logger.error('Uncaught Exception:', {
            message: error.message,
            stack: error.stack
        });
        logger_1.logger.info('Shutting down due to uncaught exception...');
        process.exit(1);
    });
};
exports.handleUncaughtExceptions = handleUncaughtExceptions;
//# sourceMappingURL=errorHandler.js.map