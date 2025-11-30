import winston from 'winston';
declare const logger: winston.Logger;
export declare const createLogger: (service: string) => {
    error: (message: string, meta?: any) => void;
    warn: (message: string, meta?: any) => void;
    info: (message: string, meta?: any) => void;
    http: (message: string, meta?: any) => void;
    debug: (message: string, meta?: any) => void;
};
export declare const logStream: {
    write: (message: string) => void;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map