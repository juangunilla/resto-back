const Pedido = require('../models/pedidos');

exports.verificarCliente = (req, res, next) => {
  const usuario = req.user; // Suponiendo que tienes información del usuario autenticado en req.user.

  if (usuario.rol === 'cliente') {
    next(); // El usuario es un cliente, permite que la solicitud continúe al controlador.
  } else {
    res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
  }
};



