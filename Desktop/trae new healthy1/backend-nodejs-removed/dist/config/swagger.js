"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUiOptions = exports.specs = exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./env");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NutriTrack API',
            version: env_1.config.API_VERSION || '1.0.0',
            description: 'Secure nutrition tracking platform API documentation',
            contact: {
                name: 'NutriTrack Team',
                email: 'support@nutritrack.com',
                url: 'https://nutritrack.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: env_1.config.NODE_ENV === 'production'
                    ? 'https://api.nutritrack.com'
                    : `http://localhost:${env_1.config.PORT}`,
                description: env_1.config.NODE_ENV === 'production'
                    ? 'Production server'
                    : 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT access token'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        },
                        code: {
                            type: 'string',
                            example: 'ERROR_CODE'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        example: 'email'
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Invalid email format'
                                    }
                                }
                            }
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Operation successful'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data'
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'integer',
                            example: 1
                        },
                        limit: {
                            type: 'integer',
                            example: 10
                        },
                        total: {
                            type: 'integer',
                            example: 100
                        },
                        pages: {
                            type: 'integer',
                            example: 10
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        tags: [
            {
                name: 'Health',
                description: 'Health check endpoints'
            },
            {
                name: 'Authentication',
                description: 'User authentication endpoints'
            },
            {
                name: 'Users',
                description: 'User management endpoints'
            },
            {
                name: 'Nutrition',
                description: 'Nutrition tracking endpoints'
            }
        ]
    },
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/models/*.ts'
    ]
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.specs = specs;
const customCss = `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info { margin: 20px 0 }
  .swagger-ui .scheme-container { margin: 20px 0 }
  .swagger-ui .opblock.opblock-post { border-color: #49cc90; }
  .swagger-ui .opblock.opblock-get { border-color: #61affe; }
  .swagger-ui .opblock.opblock-put { border-color: #fca130; }
  .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; }
  .swagger-ui .opblock.opblock-patch { border-color: #50e3c2; }
`;
const swaggerUiOptions = {
    customCss,
    customSiteTitle: 'NutriTrack API Documentation',
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        docExpansion: 'none',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        tryItOutEnabled: true
    }
};
exports.swaggerUiOptions = swaggerUiOptions;
const setupSwagger = (app) => {
    app.use('/api/docs', swagger_ui_express_1.default.serve);
    app.get('/api/docs', swagger_ui_express_1.default.setup(specs, swaggerUiOptions));
    app.get('/api/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
    console.log('📚 Swagger documentation available at /api/docs');
    console.log('📄 Swagger JSON specification available at /api/docs.json');
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map