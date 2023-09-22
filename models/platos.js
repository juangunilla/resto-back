const { create } = require('express-handlebars')
const mongoose= require('mongoose')

const platosSheme= new mongoose.Schema(
    {
        nombre:{
            type:String
        },
        descripcion:{
            type:String,
            
        },
        precios:{
            type:Number
        },
        menus:[{
            type:mongoose.Types.ObjectId,
            ref:'menu'
        }]
        
    },
    {
        timestamps:true,
        versionKey:false
    }
)
platosSheme.plugin(require('mongoose-autopopulate'));

module.exports= mongoose.model("plato",platosSheme )