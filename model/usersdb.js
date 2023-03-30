const mongoose = require('mongoose');

const logIn = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    user_type:{
        type:String,
        required:true
    },
    user_id:{
        type:Number,
        default:1
    },
    counter:{
        type:Number,
        default:0
    }
});



const registration_info = new mongoose.model('logIn', logIn);

module.exports= registration_info;