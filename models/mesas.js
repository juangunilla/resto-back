const { create } = require('express-handlebars')
const mongoose= require('mongoose')

const mesasSheme= new mongoose.Schema(
    {
        nmesa:{
            type:Number
        },
        capacidad:{
            type:Number,
            required: true
        },
        estado:{
            type:String,
            required:true
        },
        
    },
    {
        timestamps:true,
        versionKey:false
    }
)
mesasSheme.plugin(require('mongoose-autopopulate'));

module.exports= mongoose.model("mesa",mesasSheme )