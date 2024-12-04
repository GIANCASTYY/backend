const express = require('express');
const cors = require('cors');
const mongoose = require('./config/db'); // Conexión a la base de datos
const usuarioRouter = require('./routers/usuario'); // Rutas de usuarios
const verifyToken = require('./config/verifyToken'); // Middleware para verificar token

const app = express();

// Middleware de CORS configurado para permitir solicitudes desde el frontend
app.use(cors({
  origin: 'http://localhost:4200', // Asegúrate de que coincida con el puerto donde se ejecuta tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));

// Middleware para procesar solicitudes JSON
app.use(express.json());

// Rutas principales
app.use('/api/usuarios', usuarioRouter);

// Ruta protegida como ejemplo
app.get('/api/protegida', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Acceso permitido', userId: req.userId });
});

// Iniciar el servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
