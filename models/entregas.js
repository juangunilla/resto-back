const { create } = require('express-handlebars')
const mongoose= require('mongoose')

const entregasSheme= new mongoose.Schema(
    {
        pedido:{
            type:mongoose.Types.ObjectId,
            ref:'pedidos'
        },
        fecha:{
            type:Date
        },
        estado:{
            type:String
        },
        repartidor:{
            type:String,
        }
        
    },
    {
        timestamps:true,
        versionKey:false
    }
)
entregasSheme.plugin(require('mongoose-autopopulate'));

module.exports= mongoose.model("entrega",entregasSheme )