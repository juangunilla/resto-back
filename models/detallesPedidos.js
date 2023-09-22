const { create } = require('express-handlebars')
const mongoose= require('mongoose')

const detallepedidoSheme= new mongoose.Schema(
    {
        pedido:{
            type:mongoose.Types.ObjectId,
            ref:'pedidos'
        },
        platos:{
            type:mongoose.Types.ObjectId,
            ref:'platos'
        },
        cantidad:{
            type:Number
        },
        precio:{
            type:Number
        }
        
    },
    {
        timestamps:true,
        versionKey:false
    }
)
detallepedidoSheme.plugin(require('mongoose-autopopulate'));

module.exports= mongoose.model("detalle",detallepedidoSheme )