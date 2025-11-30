import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}
export interface JWTPayload {
    id: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const authorize: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map