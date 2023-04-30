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
        type:String,
    },
    address:{
        type:String,
    },
    counter:{
        type:Number,
        default:0
    },
    approval:{
        type:Boolean,
        default:false
    },
    facebook_id:{
        type:String,
    }
});



const registration_info = new mongoose.model('logIn', logIn);

module.exports= registration_info;