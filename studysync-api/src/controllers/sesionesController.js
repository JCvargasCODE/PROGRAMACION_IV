let sesiones = [];
let nextId = 1;

const listar = async (req, res) => {
  res.json({ ok: true, total: sesiones.length, datos: sesiones });
};

const obtenerUna = async (req, res) => {
  const id = parseInt(req.params.id);
  const sesion = sesiones.find(s => s.id === id);
  if (!sesion) return res.status(404).json({ error: `Sesión ${id} no encontrada` });
  res.json(sesion);
};

const crear = async (req, res) => {
  const { titulo, descripcion, fechaHora, materia } = req.body;
  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({
      error: 'El campo titulo es obligatorio',
      campos_requeridos: ['titulo'],
      campos_opcionales: ['descripcion', 'fechaHora', 'materia']
    });
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
  res.status(201).json(nuevaSesion);
};

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