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
  var houses = await house_info.find({})
  data = {
    houses:houses,
    user:req.user,
  }
  res.render('index',data)
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
    phone_number:get_data.phone_number,
    address:get_data.address,
    user:req.user,
  }
}
catch(e){
  await console.log(`the error is ${e}`)
}
res.render('users',data);
}

const logout = async (req,res)=>{
  res
    .clearCookie('access_token')
    .redirect('/');
}


const houseUpload = async (req,res) => {
  var user_id = req.params.user_id
  var get_data = await registration_info.findOne({user_id:user_id})
  var data = {
      post_id:get_data.counter,
      name:req.body.house_name,
      location:req.body.location,
      price:req.body.price, 
      phone_number:req.body.phone_number, 
      description:req.body.description,
      picture:req.body.house_name +'-'+ get_data.username+'-'+get_data.email+'-'+ get_data.counter,
      uploaderName:get_data.username,
      uploaded_by:get_data._id,
      uploader_id:user_id,
      uploader_type:get_data.user_type,
      for:get_data.user_type
  }
  await house_info.insertMany([data]);
  res.redirect(`/users/${user_id}/posts`)
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

const postDetails = async (req,res)=>{
  var user_id = req.params.user_id
  var user = await registration_info.findOne({user_id:req.params.user_id})
  var post_id = Number(req.params.post_id)
  var post = await house_info.findOne({post_id:req.params.post_id,uploader_id:req.params.user_id})
  data = {
    user_id:user_id,
    house:post,
    current_user:req.user,
    user:user
  }
  res.render('postDetails', data)
}

const postEdit = async (req,res) =>{
  var post_id = Number(req.params.post_id)
  var house = await house_info.findOne({post_id:post_id})
  data = {
    user:req.user,
    house:house
  }
  console.log('controler data: '+req.user)
  res.render('postEdit',data)
}

const postUpdate = async (req,res) =>{
  var filter = {post_id:req.params.post_id}
  var update = {
    name:req.body.name,
    location:req.body.location,
    price:req.body.price,
    description:req.body.description,
    phone_number:req.body.phone_number,
  }
  await house_info.findOneAndUpdate(filter,update)
  res.redirect(`/users/${req.user.user_id}/posts/${req.params.post_id}`)
}

const profileEdit = async (req,res)=>{
  var user_id = req.params.user_id
  var user = await registration_info.findOne({user_id:user_id})
  data = {
    email:user.email,
    name:user.username,
    type:user.user_type,
    user_id:user.user_id,
    address:user.address,
    phone_number:user.phone_number,
  }
  res.render('profileEdit',data)
}

const updateProfile = async (req,res)=>{
  
  var user_id = req.params.user_id;
  var filter = { user_id:user_id };
  var update = { 
    username:req.body.name,
    email:req.body.email,
    phone_number:req.body.phone_number,
    address:req.body.address
  };
  await registration_info.findOneAndUpdate(filter,update)
  res.redirect(`/users/${user_id}`)

}

const paymentPage = async(req,res)=>{
  data = {
    user:req.user
  }
  res.render('paymentPage',data)
}
module.exports = {
  userPage,
  home,
  logout,
  houseUpload,
  storage,
  postsPage,
  postDetails,
  postEdit,
  postUpdate,
  profileEdit,
  updateProfile,
  paymentPage,
}