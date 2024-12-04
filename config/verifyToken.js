const jwt = require('jsonwebtoken');
const config = require('./global'); // Importar la configuración global

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token']; // Leer el token del encabezado

  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'No hay token proporcionado',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        auth: false,
        message: 'Error al autenticar el token',
      });
    }

    req.userId = decoded.id; // Guardar el ID del usuario en la solicitud
    next();
  });
}

module.exports = verifyToken;
