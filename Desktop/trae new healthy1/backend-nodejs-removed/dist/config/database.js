"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.checkDatabaseHealth = exports.connectDatabase = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("./logger");
const logger = (0, logger_1.createLogger)('database');
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});
exports.prisma = prisma;
if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
        logger.debug('Query: ' + e.query);
        logger.debug('Params: ' + e.params);
        logger.debug('Duration: ' + e.duration + 'ms');
    });
}
prisma.$on('error', (e) => {
    logger.error('Database error:', e);
});
prisma.$on('warn', (e) => {
    logger.warn('Database warning:', e);
});
process.on('beforeExit', async () => {
    logger.info('Closing database connection...');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
});
const connectDatabase = async () => {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');
    }
    catch (error) {
        logger.error('Database connection failed:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const checkDatabaseHealth = async () => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        logger.error('Database health check failed:', error);
        return false;
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
exports.default = prisma;
//# sourceMappingURL=database.js.map