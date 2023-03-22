const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/test").then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('mongodb connection failed:',e);
});

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
    }
});

const collection = new mongoose.model('Collection1', logIn);

module.exports=collection;