// AGREGAR al inicio del archivo (después de la primera línea):
const { pub } = require('../redis/client');
let sesiones = [];
let nextId = 1;
// ── GET /api/sesiones
const listar = async (req, res) => {
  res.json({ ok: true, total: sesiones.length, datos: sesiones });
};
// ── GET /api/sesiones/:id
const obtenerUna = async (req, res) => {
  const id = parseInt(req.params.id);
  const sesion = sesiones.find(s => s.id === id);
  if (!sesion) return res.status(404).json({ error: `Sesión ${id} no encontrada` });
  res.json(sesion);
};
// ── POST /api/sesiones
const crear = async (req, res) => {
const { titulo, descripcion, fechaHora, materia } = req.body;
if (!titulo || titulo.trim() === '') {
return res.status(400).json({ error: 'El campo titulo es obligatorio' });
}
const nuevaSesion = {
id: nextId++,
titulo: titulo.trim(),
descripcion: descripcion || '',
materia: materia || 'General',
fechaHora: fechaHora || new Date().toISOString(),
completada: false,
creadaEn: new Date().toISOString()
};
sesiones.push(nuevaSesion);
// ✨ NUEVO: publicar evento en Redis DESPUÉS de guardar la sesión
// pub.publish(canal, mensaje_como_string_json)
await pub.publish('study:sesion:creada', JSON.stringify({
tipo: 'sesion:creada',
payload: nuevaSesion,
timestamp: new Date().toISOString()
}));
console.log('[Redis] Evento publicado: sesion:creada →', nuevaSesion.titulo);
res.status(201).json(nuevaSesion);
};

// ── PUT /api/sesiones/:id
const actualizar = async (req, res) => {
  const id = parseInt(req.params.id);
  const indice = sesiones.findIndex(s => s.id === id);
  if (indice === -1) return res.status(404).json({ error: `Sesión ${id} no encontrada` });
  sesiones[indice] = {
    ...sesiones[indice],
    ...req.body,
    id: id,
    actualizadaEn: new Date().toISOString()
  };
  res.json(sesiones[indice]);
};
// ── DELETE /api/sesiones/:id
const eliminar = async (req, res) => {
  const id = parseInt(req.params.id);
  const longitudAnterior = sesiones.length;
  sesiones = sesiones.filter(s => s.id !== id);
  if (sesiones.length === longitudAnterior) {
    return res.status(404).json({ error: `Sesión ${id} no encontrada` });
  }
  res.json({ ok: true, mensaje: `Sesión ${id} eliminada correctamente` });
};

module.exports = { listar, obtenerUna, crear, actualizar, eliminar };