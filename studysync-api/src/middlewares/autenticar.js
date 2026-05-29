// src/middlewares/autenticar.js
// Se aplica a las rutas que requieren que el usuario esté logueado
const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  // 1. Leer el header Authorization
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acceso denegado: se requiere autenticación',
      instruccion: 'Incluir el header: Authorization: Bearer <token>'
    });
  }

  // 2. Extraer el token (quitar "Bearer " del inicio)
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificar la firma del token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Adjuntar los datos del usuario al request
    req.usuario = payload;

    // 5. Pasar al siguiente middleware
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado — inicia sesión nuevamente' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = autenticar;