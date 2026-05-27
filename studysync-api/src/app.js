require('dotenv').config();
const { pub, sub } = require('./redis/client');
const express = require('express');
const app = express();

// Middlewares globales
app.use(express.json());

app.use('/api/sesiones', require('./routes/sesiones'));
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// express.static('public') sirve todos los archivos de la carpeta public/
app.use(express.static('public'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    mensaje: 'StudySync API funcionando',
    version: '1.0.0',
    endpoints: ['/api/sesiones', '/auth/register', '/auth/login', '/api-docs']
  });
});

// Manejador de errores global (siempre al final)
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ruta: req.path
  });
});

module.exports = app;