let usuarios = [
    { id: 1, nombre: "Juan", edad: 20 },
    { id: 2, nombre: "Maria", edad: 22 }
];

const obtenerUsuarios = (req, res) => {
    res.status(200).json(usuarios);
};

const obtenerUsuario = (req, res) => {
    const id = parseInt(req.params.id);

    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }

    res.status(200).json(usuario);
};

const crearUsuario = (req, res) => {
    const { nombre, edad } = req.body;

    if (!nombre || !edad) {
        return res.status(400).json({
            mensaje: "Faltan datos"
        });
    }

    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        edad
    };

    usuarios.push(nuevoUsuario);

    res.status(201).json(nuevoUsuario);
};

const actualizarUsuario = (req, res) => {
    const id = parseInt(req.params.id);

    const { nombre, edad } = req.body;

    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }

    usuario.nombre = nombre;
    usuario.edad = edad;

    res.status(200).json(usuario);
};

const eliminarUsuario = (req, res) => {
    const id = parseInt(req.params.id);

    const index = usuarios.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }

    usuarios.splice(index, 1);

    res.status(200).json({
        mensaje: "Usuario eliminado"
    });
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};