const { create } = require('express-handlebars')
const mongoose= require('mongoose')

const clientesSheme= new mongoose.Schema(
    {
        Nombre:{
            type:mongoose.Types.ObjectId,
            ref:'pedidos'
        },
        Direccion:{
            type:mongoose.Types.ObjectId,
            ref:'platos'
        },
        tel:{
            type:Number
        },
        correo:{
            type:String,
            match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        }
        
    },
    {
        timestamps:true,
        versionKey:false
    }
)
clientesSheme.plugin(require('mongoose-autopopulate'));

module.exports= mongoose.model("cliente",clientesSheme )