const { create } = require('express-handlebars')
const mongoose= require('mongoose')

const reservasSheme= new mongoose.Schema(
    {
        fecha:{
            type:Date
        },
        mesa:[{
            type:mongoose.Types.ObjectId,
            ref:'mesa'
        }],
        cliente:[{
            type:mongoose.Types.ObjectId,
            ref:'cliente'
        }],
        Npersonas:{
            type:Number
        }
        
    },
    {
        timestamps:true,
        versionKey:false
    }
)
reservasSheme.plugin(require('mongoose-autopopulate'));

module.exports= mongoose.model("reserva",reservasSheme )