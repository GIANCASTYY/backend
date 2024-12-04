const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/global');

// Crear un nuevo usuario (registro)
exports.crearUsuario = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  // Verificar que los datos necesarios estén presentes
  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si el correo ya está registrado
    const usuarioExistente = await User.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      correo,
      contrasena: contrasenaHash,
    });

    // Guardar el nuevo usuario
    await nuevoUsuario.save();

    // Responder con el nuevo usuario (puedes ajustar los campos a devolver)
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
      }
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
};

// Iniciar sesión
exports.obtenerUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    console.log('Datos recibidos para login:', { correo, contrasena });

    // Buscar el usuario por correo
    const usuario = await User.findOne({ correo });
    if (!usuario) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la almacenada
    const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esContrasenaValida) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario._id }, config.secret, { expiresIn: '1h' });
    console.log('Inicio de sesión exitoso', { token });

    // Responder con el token
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      }
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};
