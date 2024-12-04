const mongoose = require('mongoose');
const config = require('./global'); // Importar la configuración global

mongoose.connect(config.mongoURI)
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch((err) => console.error('Error al conectar a la base de datos:', err));

module.exports = mongoose;
