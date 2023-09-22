const Pedido = require('../models/pedidos');

exports.crearPedido = async (req, res) => {
  try {
    const usuario = req.user; // Suponiendo que tienes información del usuario autenticado en req.user.

    if (usuario.rol === 'cliente') {
      const nuevoPedido = new Pedido({
        fecha: new Date(),
        estado: 'pendiente',
        mesa: req.body.mesaId,
        cliente: usuario._id,
      });

      await nuevoPedido.save();

      res.status(201).json(nuevoPedido);
    } else {
      res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};
