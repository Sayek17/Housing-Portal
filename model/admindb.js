const mongoose = require('mongoose');
const admin = new mongoose.Schema({
    userCounter:{
        type:Number,
        default:0
    }
})

const admin_info = new mongoose.model('admin',admin);
module.exports= admin_info;