require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Puerto
const PORT = process.env.PORT || 3000;

// Base de datos en memoria
let usuarios = [
    { id: 1, nombre: "Juan", edad: 20 },
    { id: 2, nombre: "Maria", edad: 22 }
];

// GET - Listar todos
app.get('/api/usuarios', (req, res) => {
    res.status(200).json(usuarios);
});

// GET - Obtener por ID
app.get('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
});

// POST - Crear usuario
app.post('/api/usuarios', (req, res) => {
    const { nombre, edad } = req.body;

    if (!nombre || !edad) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        edad
    };

    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

// PUT - Actualizar usuario
app.put('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, edad } = req.body;

    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!nombre || !edad) {
        return res.status(400).json({ mensaje: "Faltan datos" });
    }

    usuario.nombre = nombre;
    usuario.edad = edad;

    res.status(200).json(usuario);
});

// DELETE - Eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuarios.splice(index, 1);
    res.status(200).json({ mensaje: "Usuario eliminado" });
});

// Middleware de errores
app.use((err, req, res, next) => {
    res.status(500).json({ mensaje: "Error interno del servidor" });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});