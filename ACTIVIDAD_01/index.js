require('dotenv').config();

const express = require('express');

const usuariosRoutes = require('./routes/usuariosRoutes');

const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});