// src/routes/sesiones.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sesionesController');
const autenticar = require('../middlewares/autenticar');

router.get('/',    ctrl.listar);        // Público
router.get('/:id', ctrl.obtenerUna);   // Público
router.post('/',   autenticar, ctrl.crear);     // PRIVADO
router.put('/:id', autenticar, ctrl.actualizar); // PRIVADO
router.delete('/:id', autenticar, ctrl.eliminar); // PRIVADO

module.exports = router;