const express = require('express');
const router = express.Router();
const { crearUsuario, obtenerUsuario } = require('../controles/userControllers');

// Ruta para registrar un usuario
router.post('/register', crearUsuario);

// Ruta para iniciar sesión
router.post('/login', obtenerUsuario);

module.exports = router;
