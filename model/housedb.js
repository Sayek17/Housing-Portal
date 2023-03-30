const mongoose = require('mongoose');

const house = new mongoose.Schema({
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
    uploaded_by:{
        type:String,
        required: true
    }
})

const house_info = new mongoose.model('house', house)

module.exports = house_info;