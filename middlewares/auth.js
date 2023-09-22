const jwt = require('jsonwebtoken');
const moment = require('moment');
const { secret } = require('../services/jwt');

exports.auth = (req, res, next) => {
  // Comprobar si me llega la cabecera de auth
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "La petición no tiene la cabecera de autenticación",
    });
  }

  // Limpiar el token
  let token = req.headers.authorization.replace(/['"]+/g, '');

  // Decodificar token
  try {
    let payload = jwt.verify(token, secret);

    // Comprobar expiración del token
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: "error",
        message: "Token expirado",
      });
    }

    // Agregar datos de usuario a request
    req.user = payload;

    // Incluir el rol en la cabecera
    res.setHeader('X-User-Rol', payload.rol);
    console.log(payload);
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Token inválido",
      error,
    });
  }
  


  // Pasar a ejecución de acción
  next();
};
