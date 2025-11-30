import { Express } from 'express';
declare const specs: object;
declare const swaggerUiOptions: {
    customCss: string;
    customSiteTitle: string;
    explorer: boolean;
    swaggerOptions: {
        persistAuthorization: boolean;
        displayRequestDuration: boolean;
        filter: boolean;
        showExtensions: boolean;
        showCommonExtensions: boolean;
        docExpansion: string;
        defaultModelsExpandDepth: number;
        defaultModelExpandDepth: number;
        tryItOutEnabled: boolean;
    };
};
export declare const setupSwagger: (app: Express) => void;
export { specs, swaggerUiOptions };
//# sourceMappingURL=swagger.d.ts.map