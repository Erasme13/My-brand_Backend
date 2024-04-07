import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My portifolio',
            version: '1.0.0',
            description: 'API documentation for my application',
        },
        servers: [
            {
                url: 'http://localhost:3000', 
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

export default swaggerOptions;
