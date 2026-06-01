// src/routes/sesiones.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sesionesController');
const autenticar = require('../middlewares/autenticar');

/**
 * @swagger
 * tags:
 *   name: Sesiones
 *   description: CRUD de sesiones de estudio
 */

/**
 * @swagger
 * /api/sesiones:
 *   get:
 *     summary: Listar todas las sesiones de estudio
 *     tags: [Sesiones]
 *     responses:
 *       200:
 *         description: Lista de sesiones
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               total: 2
 *               datos:
 *                 - id: 1
 *                   titulo: "Redis Pub/Sub"
 *                   materia: "Programación IV"
 */
router.get('/', ctrl.listar);

/**
 * @swagger
 * /api/sesiones/{id}:
 *   get:
 *     summary: Obtener una sesión por ID
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Sesión encontrada
 *       404:
 *         description: Sesión no encontrada
 */
router.get('/:id', ctrl.obtenerUna);

/**
 * @swagger
 * /api/sesiones:
 *   post:
 *     summary: Crear una nueva sesión (requiere login)
 *     tags: [Sesiones]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo]
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Sesión de Redis Pub/Sub"
 *               materia:
 *                 type: string
 *                 example: "Programación IV"
 *               descripcion:
 *                 type: string
 *                 example: "Repaso de canales y suscriptores"
 *               fechaHora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-01T10:00:00.000Z"
 *     responses:
 *       201:
 *         description: Sesión creada exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       401:
 *         description: Token JWT no proporcionado o inválido
 */
router.post('/', autenticar, ctrl.crear);

/**
 * @swagger
 * /api/sesiones/{id}:
 *   put:
 *     summary: Actualizar una sesión existente (requiere login)
 *     tags: [Sesiones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Sesión actualizada"
 *               materia:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               completada:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Sesión actualizada
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No tienes permiso para modificar esta sesión
 *       404:
 *         description: Sesión no encontrada
 */
router.put('/:id', autenticar, ctrl.actualizar);

/**
 * @swagger
 * /api/sesiones/{id}:
 *   delete:
 *     summary: Eliminar una sesión (requiere login)
 *     tags: [Sesiones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Sesión eliminada
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               mensaje: "Sesión 1 eliminada"
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No tienes permiso para eliminar esta sesión
 *       404:
 *         description: Sesión no encontrada
 */
router.delete('/:id', autenticar, ctrl.eliminar);

module.exports = router;