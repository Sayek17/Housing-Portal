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
    phone_number:{
        type:Number,
    },
    address:{
        type:String,
    },
    ba_number:{
        type:String,
    },
    bkash:{
        type:String,
    },
    counter:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        required:true
    }
});



const registration_info = new mongoose.model('logIn', logIn);

module.exports= registration_info;