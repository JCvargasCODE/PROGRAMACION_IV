require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// ── Seguridad (Paso 12) ───────────────────────────────────────────────
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');
const helmet      = require('helmet');

// 1. Helmet: cabeceras HTTP de seguridad automáticas
app.use(helmet());

// 2. CORS: controla qué dominios pueden llamar a la API
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Rate Limiting: máx 100 peticiones por IP cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas peticiones. Espera 15 minutos e intenta nuevamente.' },
  standardHeaders: true
});
app.use('/api/', limiter);

// ── Middlewares globales ──────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Log de peticiones
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ── Rutas ─────────────────────────────────────────────────────────────
app.use('/auth',          require('./routes/auth'));
app.use('/api/sesiones',  require('./routes/sesiones'));

// Ruta raíz
app.get('/health', (req, res) => {
  res.json({
    mensaje: 'StudySync API funcionando',
    version: '1.0.0',
    endpoints: ['/api/sesiones', '/auth/register', '/auth/login']
  });
});

// ── Swagger ───────────────────────────────────────────────────────────
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'StudySync API Docs',
  swaggerOptions: { persistAuthorization: true }
}));

// ── Manejador de errores global ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ruta: req.path
  });
});

module.exports = app;