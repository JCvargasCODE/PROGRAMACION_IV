API REST - Gestión de Usuarios
- Descripción de la entidad

Este proyecto consiste en una API REST desarrollada con Node.js y Express, utilizando arquitectura MVC.

La entidad principal es Usuario, que representa un registro con los siguientes atributos:

id (identificador único)
nombre (nombre del usuario)
edad (edad del usuario)

La API permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre los usuarios.

- Tecnologías utilizadas
Node.js
Express
dotenv
Arquitectura MVC
Render (deploy)
Endpoints disponibles
🔹 Obtener todos los usuarios

GET /api/usuarios

🔹 Obtener un usuario por ID

GET /api/usuarios/:id

🔹 Crear un nuevo usuario

POST /api/usuarios

Body (JSON):
{
"nombre": "Carlos",
"edad": 25
}

🔹 Actualizar usuario

PUT /api/usuarios/:id

Body (JSON):
{
"nombre": "Juan actualizado",
"edad": 30
}

🔹 Eliminar usuario

DELETE /api/usuarios/:id

🌎 URL de producción

https://api-usuarios-x9t4.onrender.com

👨‍💻 Autor

Proyecto académico - Programación IV
2026


GIT HUB 

https://github.com/JCvargasCODE/PROGRAMACION_IV.git

GET   http://localhost:3000/api/usuarios
