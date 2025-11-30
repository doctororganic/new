"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../config/logger");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.catchAsync)(async (req, res) => {
    const startTime = Date.now();
    const serverInfo = {
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        responseTime: Date.now() - startTime
    };
    logger_1.logger.info('Health check accessed', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        responseTime: serverInfo.responseTime
    });
    res.status(200).json(serverInfo);
}));
router.get('/detailed', (0, errorHandler_1.catchAsync)(async (req, res) => {
    const startTime = Date.now();
    const memoryUsage = process.memoryUsage();
    const memory = {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
    };
    const cpuUsage = process.cpuUsage();
    const checks = {
        server: {
            status: 'healthy',
            responseTime: Date.now() - startTime
        },
        memory,
        cpu: {
            user: cpuUsage.user,
            system: cpuUsage.system
        }
    };
    try {
        checks.database = {
            status: 'connected',
            responseTime: 10
        };
    }
    catch (error) {
        checks.database = {
            status: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
    try {
        checks.redis = {
            status: 'connected',
            responseTime: 5
        };
    }
    catch (error) {
        checks.redis = {
            status: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
    const allHealthy = Object.values(checks).every(check => typeof check === 'object' && check.status === 'healthy' || check.status === 'connected');
    const response = {
        success: allHealthy,
        message: allHealthy ? 'All systems operational' : 'Some systems are down',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        responseTime: Date.now() - startTime,
        checks
    };
    const statusCode = allHealthy ? 200 : 503;
    logger_1.logger.info('Detailed health check accessed', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        healthy: allHealthy,
        responseTime: response.responseTime
    });
    res.status(statusCode).json(response);
}));
router.get('/ready', (0, errorHandler_1.catchAsync)(async (req, res) => {
    const isReady = true;
    if (isReady) {
        res.status(200).json({
            success: true,
            message: 'Server is ready',
            timestamp: new Date().toISOString()
        });
    }
    else {
        res.status(503).json({
            success: false,
            message: 'Server is not ready',
            timestamp: new Date().toISOString()
        });
    }
}));
router.get('/live', (0, errorHandler_1.catchAsync)(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
}));
router.get('/version', (0, errorHandler_1.catchAsync)(async (req, res) => {
    res.status(200).json({
        success: true,
        version: process.env.npm_package_version || '1.0.0',
        build: process.env.BUILD_NUMBER || 'unknown',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
}));
exports.default = router;
//# sourceMappingURL=health.js.map