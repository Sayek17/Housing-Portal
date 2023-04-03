// const express = require('express');
const registration_info = require('../model/usersdb')
var house_info = require('../model/housedb');

// multer config
var multer = require('multer');
var storage = multer.diskStorage({
    destination:  (req,file,cb) =>{
        cb(null,'./public/images')
    },
    filename:  async (req,file,cb)=>{
        var user_id = req.params.user_id
        var get_data = await registration_info.findOne({user_id:user_id})
        var counter = get_data.counter
        counter = counter +1
        var filter = {user_id:get_data.user_id}
        var update = {counter:counter}
        await registration_info.findOneAndUpdate(filter,update)
        cb(null, req.body.house_name +'-'+ get_data.username+'-'+get_data.email+'-'+counter)
    }
})


// controllers
const home = async function (req, res){
  res.render('index')
}

const userPage = async function(req, res, next) {
  var user_id = req.params.user_id
try{
  var get_data = await registration_info.findOne({user_id:user_id})
  var houses = await house_info.find({uploaded_by:get_data._id})
  var data = {
    email:get_data.email,
    name:get_data.username,
    type:get_data.user_type,
    user_id:get_data.user_id,
    houses:houses,
  }
}
catch(e){
  await console.log(`the error is ${e}`)
}
res.render('users',data);
}


const houseUpload = async (req,res) => {
  var user_id = req.params.user_id
  var get_data = await registration_info.findOne({user_id:user_id})
  console.log(user_id)
  var data = {
      name:req.body.house_name,
      location:req.body.location,
      price:req.body.price,
      picture:req.body.house_name +'-'+ get_data.username+'-'+get_data.email+'-'+ get_data.counter,
      uploaded_by:get_data._id
  }
  await house_info.insertMany([data]);
  res.redirect(`/users/${user_id}`)
}

const postsPage = async (req,res)=>{
  var user_id = req.params.user_id
  var user = await registration_info.findOne({user_id:user_id})
  var id = user._id
  data = {
    user_id:user_id,
    houses: await house_info.find({uploaded_by:id})
  
  }
  res.render('posts', data)
}

const profileEdit = async (req,res)=>{
  var user_id = req.params.user_id
  var user = await registration_info.findOne({user_id:user_id})
  data = {
    email:user.email,
    name:user.username,
    type:user.user_type,
    user_id:user.user_id,
  }
  res.render('profileEdit',data)
}

const updateProfile = async (req,res)=>{
  
  var user_id = req.params.user_id;
  var filter = { user_id:user_id };
  var update = { username:req.body.name,email:req.body.email};
  await registration_info.findOneAndUpdate(filter,update)
  res.redirect(`/users/${user_id}`)

}


module.exports = {
  userPage,
  home,
  houseUpload,
  storage,
  postsPage,
  profileEdit,
  updateProfile
}