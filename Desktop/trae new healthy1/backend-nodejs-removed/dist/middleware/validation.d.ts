import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const validateRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateWithJoi: (schema: Joi.ObjectSchema, target?: "body" | "params" | "query") => (req: Request, res: Response, next: NextFunction) => void;
export declare const sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRateLimit: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateContentType: (allowedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRequestSize: (maxSize: number) => (req: Request, res: Response, next: NextFunction) => void;
export declare const commonSchemas: {
    objectId: Joi.StringSchema<string>;
    email: Joi.StringSchema<string>;
    password: Joi.StringSchema<string>;
    pagination: Joi.ObjectSchema<any>;
    dateRange: Joi.ObjectSchema<any>;
};
declare const _default: {
    validateRequest: (req: Request, res: Response, next: NextFunction) => void;
    validateWithJoi: (schema: Joi.ObjectSchema, target?: "body" | "params" | "query") => (req: Request, res: Response, next: NextFunction) => void;
    sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
    validateRateLimit: (req: Request, res: Response, next: NextFunction) => void;
    validateContentType: (allowedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => void;
    validateRequestSize: (maxSize: number) => (req: Request, res: Response, next: NextFunction) => void;
    commonSchemas: {
        objectId: Joi.StringSchema<string>;
        email: Joi.StringSchema<string>;
        password: Joi.StringSchema<string>;
        pagination: Joi.ObjectSchema<any>;
        dateRange: Joi.ObjectSchema<any>;
    };
};
export default _default;
//# sourceMappingURL=validation.d.ts.map