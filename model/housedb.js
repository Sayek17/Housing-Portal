const mongoose = require('mongoose');

const house = new mongoose.Schema({
    post_id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required: true
    },
    location:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required: true
    },
    picture : {
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    phone_number:{
        type:Number,
        required: true
    },
    uploaded_by:{
        type:String,
        required: true
    },
    uploader_id:{
        type:Number,
        required: true
    },
    for:{
        type:String,
        required: true
    },
    approval:{
        type:Boolean,
        default:false
    }
})

const house_info = new mongoose.model('house', house)

module.exports = house_info;