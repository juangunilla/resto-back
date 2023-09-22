const { create } = require('express-handlebars')
const mongoose= require('mongoose')

const menusSheme= new mongoose.Schema(
    {
        nombre:{
            type:String
        },
        categoria:{
            type:String,
            
        },
        descripcion:{
            type:String,
            
        },
        precios:{
            type:Number
        }
        
    },
    {
        timestamps:true,
        versionKey:false
    }
)
menusSheme.plugin(require('mongoose-autopopulate'));

module.exports= mongoose.model("menu",menusSheme )