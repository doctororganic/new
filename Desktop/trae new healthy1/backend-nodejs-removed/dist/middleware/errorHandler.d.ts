import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    code?: string;
    constructor(message: string, statusCode: number, code?: string);
}
export declare const errorHandler: (error: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
export declare const catchAsync: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const handleUnhandledRejections: () => void;
export declare const handleUncaughtExceptions: () => void;
//# sourceMappingURL=errorHandler.d.ts.map