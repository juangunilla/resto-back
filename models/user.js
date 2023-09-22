const { create } = require('express-handlebars')
const mongoose= require('mongoose')

const userSheme= new mongoose.Schema(
    {
        correo:{
            type:String,
            match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        },
        usuario:{
            type:String,
            required: true
        },
        password:{
            type:String,
            required:true
        },
        rol: {
            type: String,
            enum: ["admin", "mozos", "cliente","repartidor"],
            required: true
          },
          image:{
            type:String,
            default:"default.png"
        },
        profesional:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'profesionales'
        }]
        
    },
    {
        timestamps:true,
        versionKey:false
    }
)
userSheme.plugin(require('mongoose-autopopulate'));

module.exports= mongoose.model("user",userSheme )