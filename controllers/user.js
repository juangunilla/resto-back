const res = require('express/lib/response');
const { default: mongoose, model } = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const nodemailer = require("nodemailer");
//importar servicios
const jwtService = require("../services/jwt");
const fs = require('fs');
const { error } = require('console');
const path = require('path');

const getItems = async (req, res) => {
  const { body } = req
  const { correo } = req.body
  const { password } = req.body
  if (!correo || !password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar o no estas registrado"
    })
  } else {
    const data = await user.findOne({ correo: body.correo });

    if (!data || !data.password) {
      console.log("Correo inválido o no registrado");
      return res.status(404).send({
        status: "error",
        message: "Correo incorrecto o no registrado"
      });
    }
    let pwd = await bcrypt.compareSync(password, data.password)
    if (pwd == false) {
      console.log("Contraseña incorrecta");
      res.status(404).send({ status: "error", message: "contraseña incorrecta" })
    } else {
      const token = jwtService.createTokens(data)
      res.header('X-User-Rol', data.rol);
      res.status(200).send({
        status: "login", message: "Entrando a la base de datos",
        data: {
          data: {
            correo: data.correo,
            nombre: data.nombreyapellido,
            id: data._id,
            rol: data.rol,
            image: data.image
          },

          token

        }

      })
    }
  }


  //.select({"password":0})

};

const profile = async (req, res) => {
  const { _id } = req.params;
  try {
    const data = await user.findById(_id).select({ password: 0 });
    if (!data) {
      return res.status(404).send({
        status: "error",
        message: "El usuario no existe"
      });
    }
    res.header('X-User-Rol', data.rol);
    return res.status(200).send({
      status: "success",
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener el usuario"
    });
  }
}

const filePath = path.resolve(__dirname, 'template/register.html');



const postItem = async (req, res) => {
  const { body } = req;
  const { nombreyapellido } = req.body;
  const { correo } = req.body;
  const existingUser = await user.findOne({ correo });
  if (existingUser) {
    return res.status(400).send({
      status: 'Ya tienes una cuenta',
      message: 'El usuario ya tiene una cuenta',
    });
  }

  bcrypt.hash(body.password, 10, (error, pwd) => {
    if (error) {
      return res.status(500).send({
        status: 'error',
        message: 'Error al hashear la contraseña.',
      });

    }

    body.password = pwd;

    const data = user.create(body)



    fs.readFile(filePath, 'utf8', (error, template) => {
      if (error) {
        console.log('Error al leer el archivo HTML:', error);
        return res.status(500).send({
          status: 'error',
          message: 'Error al leer el archivo HTML.',
        });
      }
      const htmlContent = template.replace('[Nombre]', nombreyapellido);

      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        requireTLS: false,
        auth: {
          user: 'intelisepa@outlook.com',
          pass: 'inteli0306',
        },
      });

      const mailOptions = {
        from: 'intelisepa@outlook.com',
        to: body.correo,
        subject: 'Registro exitoso',
        html: htmlContent,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error al enviar el correo:', error);
          return res.status(500).send({
            status: 'error',
            message: 'Error al enviar el correo.',
          });
        } else {
          console.log('Correo enviado:', info.response);
          return res.status(200).send({
            status: 'success',
            message: 'El usuario fue creado con éxito.',
          });
        }
      });
    });
  });
};

const uploader = (req, res) => {
  // Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
    return res.status(404).send({
      status: 'error',
      message: 'Petición no incluye la imagen'
    });
  }

  // Obtener el nombre generado por Multer
  const generatedImageName = req.file.filename;

  // Sacar la extensión del archivo original
  const extension = generatedImageName.split('.').pop();

  // Comprobar la extensión
  if (!['png', 'jpg', 'jpeg', 'gif'].includes(extension)) {
    const filePath = req.file.path;
    fs.unlinkSync(filePath); // Eliminar el archivo
    // Devolver respuesta negativa
    return res.status(400).send({
      status: 'error',
      message: 'Extensión del archivo inválida'
    });
  }

  // Si la extensión es correcta, eliminar la foto anterior y actualizar el atributo "image"
  const oldImage = req.user.image;

  user.findByIdAndUpdate(
    req.user.id,
    { image: generatedImageName },
    { new: true }
  )
    .then(userUpdated => {
      if (!userUpdated) {
        throw new Error('Usuario no encontrado');
      }

      // Eliminar la foto anterior si existe
      if (oldImage) {
        const oldImagePath = path.join(__dirname, '..', 'img', 'upload', oldImage);
        fs.unlinkSync(oldImagePath);
      }

      return res.status(200).send({
        status: 'success',
        user: userUpdated,
        file: req.file
      });
    })
    .catch(error => {
      return res.status(500).send({
        status: 'error',
        message: 'Error al subir el avatar'
      });
    });
};


const avatar = (req, res) => {
  //sacar el parametro de la url
  const file =req.params.file

  //montar el path real de la imagen
  const filePath = './img/upload/'+file

  //comprobar que existe
  fs.stat(filePath,(error,exists)=>{
    if(!exists)return res.status(404).send({
      status: 'error',
      message: 'No existe la imagen'
    })
    //devolver un file
  return res.sendFile(path.resolve(filePath))
  
  })
  
}

const updateAvatar = async(req, res)=>{
  const {_id}= req.params;
  const {image}= req.body;
  try {
    await user.findByIdAndUpdate(_id, { image: image });
    return res.status(200).send({ status: "success", message: "El avatar fue cambiado con éxito." });
  } catch (error) {
    console.log('Error al modificar el avatar:', error);
    return res.status(500).send({ status: 'error', message: 'Error al modificar el avatar' });
  }
}



const updateCorreo = async (req, res) => {
  const { _id } = req.params;
  const { correo, confirmCorreo } = req.body;
  if (correo !== confirmCorreo) {
    return res.status(400).json({ error: "los correos no coinciden." });
  }
  try {
    await user.findByIdAndUpdate(_id, { correo: correo });
    return res.status(200).send({ status: "success", message: "El correo fue cambiado con éxito." });
  } catch (error) {
    console.log('Error al modificar el correo:', error);
    return res.status(500).send({ status: 'error', message: 'Error al modificar el correo' });
  }
}

//Cambiar contraseña 
const updateItem = async (req, res) => {
  const { _id } = req.params;
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await user.findByIdAndUpdate(_id, { password: hashedPassword });
    return res.status(200).send({
      status: "success"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el usuario");
  }
};
const getUsuarios = async (req, res) => {
  const data = await user.find({}).select('-password')
  return res.status(200).send({
    status: "success",
    usuarios: data
  })
}



module.exports = { getItems, getUsuarios, postItem, updateItem, profile, updateCorreo, uploader,updateAvatar,avatar }