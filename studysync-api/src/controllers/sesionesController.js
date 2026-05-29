// src/controllers/sesionesController.js — CON PRISMA
const prisma = require('../db');
const { pub } = require('../redis/client');

// GET /api/sesiones — listar todas
const listar = async (req, res) => {
  const sesiones = await prisma.sesion.findMany({
    include: { usuario: { select: { id: true, nombre: true, email: true } } },
    orderBy: { creadaEn: 'desc' }
  });
  res.json({ ok: true, total: sesiones.length, datos: sesiones });
};

// GET /api/sesiones/:id — obtener una
const obtenerUna = async (req, res) => {
  const id = parseInt(req.params.id);
  const sesion = await prisma.sesion.findUnique({
    where: { id },
    include: { usuario: { select: { id: true, nombre: true } } }
  });
  if (!sesion) return res.status(404).json({ error: `Sesión ${id} no encontrada` });
  res.json(sesion);
};

// POST /api/sesiones — crear
const crear = async (req, res) => {
  const { titulo, descripcion, fechaHora, materia } = req.body;
  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ error: 'El campo titulo es obligatorio' });
  }

  const sesion = await prisma.sesion.create({
    data: {
      titulo: titulo.trim(),
      descripcion: descripcion || '',
      materia: materia || 'General',
      fechaHora: fechaHora ? new Date(fechaHora) : new Date(),
      usuarioId: req.usuario.id
    },
    include: { usuario: { select: { nombre: true } } }
  });

  // Publicar 3 eventos en Redis
  await pub.publish('study:sesion:creada', JSON.stringify({
    tipo: 'sesion:creada',
    payload: sesion,
    timestamp: new Date().toISOString(),
    version: '1.0'
  }));
  await pub.publish('study:usuario:unido', JSON.stringify({
    tipo: 'usuario:unido',
    payload: { usuario: sesion.usuario.nombre, grupo: sesion.materia },
    timestamp: new Date().toISOString(),
    version: '1.0'
  }));
  await pub.publish('study:material:publicado', JSON.stringify({
    tipo: 'material:publicado',
    payload: { materia: sesion.materia, titulo: sesion.titulo, autor: sesion.usuario.nombre },
    timestamp: new Date().toISOString(),
    version: '1.0'
  }));

  console.log('[Redis] 3 eventos publicados →', sesion.titulo);
  res.status(201).json(sesion);
};

// PUT /api/sesiones/:id — actualizar
const actualizar = async (req, res) => {
  const id = parseInt(req.params.id);
  const sesionExistente = await prisma.sesion.findUnique({ where: { id } });
  if (!sesionExistente) return res.status(404).json({ error: 'Sesión no encontrada' });
  if (sesionExistente.usuarioId !== req.usuario.id) {
    return res.status(403).json({ error: 'No tienes permiso para modificar esta sesión' });
  }
  const { titulo, descripcion, materia, completada } = req.body;
  const sesion = await prisma.sesion.update({
    where: { id },
    data: { titulo, descripcion, materia, completada }
  });
  res.json(sesion);
};

// DELETE /api/sesiones/:id — eliminar
const eliminar = async (req, res) => {
  const id = parseInt(req.params.id);
  const sesionExistente = await prisma.sesion.findUnique({ where: { id } });
  if (!sesionExistente) return res.status(404).json({ error: 'Sesión no encontrada' });
  if (sesionExistente.usuarioId !== req.usuario.id) {
    return res.status(403).json({ error: 'No tienes permiso para eliminar esta sesión' });
  }
  await prisma.sesion.delete({ where: { id } });
  res.json({ ok: true, mensaje: `Sesión ${id} eliminada` });
};

module.exports = { listar, obtenerUna, crear, actualizar, eliminar };