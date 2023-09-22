const express = require('express');
const router = express.Router();
const controladorPedidos = require('../controllers/pedidos'); // Reemplaza con la ubicación de tu controlador de pedidos.
const { verificarCliente } = require('../middlewares/pedidos'); // Importa el middleware correctamente.

router.post('/', verificarCliente, controladorPedidos.crearPedido);

module.exports = router;
