const { create } = require('express-handlebars')
const mongoose= require('mongoose')

const peidosSheme= new mongoose.Schema(
    {
        fecha:{
            type:Date
        },
        estado:{
            type:String,
            
        },
        mesa:[{
            type:mongoose.Types.ObjectId,
            ref:'mesas'
        }],
        cliente:[{
            type:mongoose.Types.ObjectId,
            ref:'clientes'
        }]
        
    },
    {
        timestamps:true,
        versionKey:false
    }
)
peidosSheme.plugin(require('mongoose-autopopulate'));

module.exports= mongoose.model("pedido",peidosSheme )