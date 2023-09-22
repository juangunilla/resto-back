require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/database')
const port = process.env.PORT || 3000;
//inicializar
const app = express();
app.use(cors())
app.use(express.json())

app.use('/api/users', require('./routes/user'))
app.use('/api/mesa',require('./routes/mesas'))
app.use('/api/menus',require('./routes/menus'))
app.use('/api/platos',require('./routes/platos'))
app.use('/api/pedido',require('./routes/pedidos'))
app.use('/api/detalle',require('./routes/detallePedidos'))
app.use('/api/clientes',require('./routes/clientes'))
app.use('/api/entrega',require('./routes/entrega'))
app.use('/api/reserva',require('./routes/reserva'))

dbConnect()

const server = app.listen(port, () => {
    console.log(`Tu app está lista por el puerto http://localhost:${port}`);
  });
  