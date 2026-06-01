// src/swagger/config.js
const swaggerJsdoc = require('swagger-jsdoc');

const opciones = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StudySync API',
      version: '1.0.0',
      description: 'API para coordinación de grupos de estudio con notificaciones en tiempo real',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desarrollo local' },
      { url: 'https://studysync-api-7n8v.onrender.com', description: 'Producción' }
    ],
    tags: [
      { name: 'Autenticación', description: 'Registro y login de usuarios' },
      { name: 'Sesiones',      description: 'CRUD de sesiones de estudio'  }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(opciones);