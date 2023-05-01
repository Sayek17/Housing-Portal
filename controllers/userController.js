const registration_info = require('../model/usersdb')
const house_info = require('../model/housedb');
const user_review = require('../model/reviewdb')
const nodemailer = require("nodemailer");
// multer config
var multer = require('multer');
// const { get } = require('mongoose');
var storage = multer.diskStorage({ //uploading images in the public/images
    destination:  (req,file,cb) =>{
        cb(null,'./public/images')
    },
    filename:  async (req,file,cb)=>{
        var user_id = req.user.user_id
        var user_data = await registration_info.findOne({user_id:user_id})
        var counter = user_data.counter
        counter = counter +1
        var filter = {user_id:user_data.user_id}
        var update = {counter:counter}
        await registration_info.findOneAndUpdate(filter,update)
        cb(null, req.body.house_name +'-'+ user_data.username+'-'+user_data.email+'-'+counter)
    }
})


// controllers
const home = async function (req, res){
  var houses = await house_info.find({})
  var users = await registration_info.find({})
  for (house in houses ){
    for (user in users){
      if (houses[house].uploaded_by==users[user]._id){
        var update = {
          uploaderName:users[user].username,
          uploader_phone:users[user].phone_number,
          uploader_rating:users[user].rating,
        }
        await house_info.findOneAndUpdate({_id:houses[house]._id},update)
      }  
    }
  }
  data = {
    houses:houses,
    user:req.user,
  }
  res.render('index',data)
}

const contactUsPage = async (req,res)=>{
  data = {
    user:req.user
  }
  res.render('contactUs',data)
}
const contactUsPost = async (req,res)=>{
  var fullName = req.body.fullName
  var email = req.user.email
  var contactReason = req.body.contactReason
  var emailText = ` ${fullName} has contacted for admin support from email: ${email},
   their messege is: ${contactReason}`
  const emailFrom = "md.isa.sayek.huda@g.bracu.ac.bd" //housing portal business email address
  const emailTO = "isasayek@gmail.com"/// admin email address

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: `${emailFrom}`, // replace with your actual Gmail email address
      pass: "vihmyswmqrtxitpj" // replace with your actual Gmail email password
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Housing Portal" <${emailFrom}>`, // sender address
    to: `${emailTO}`, // list of receivers
    subject: "Housing Portal", // Subject line
    text: `${emailText}`, // plain text body
    html: `<b>${emailText}</b`, // html body
  });
  res.redirect('/')
}

const userPage = async function(req, res) {
  var user_id = req.params.user_id
  var get_data = await registration_info.findOne({user_id:user_id})
  var houses = await house_info.find({uploaded_by:get_data._id})
  var data = {
    houses:houses,
    user:req.user,
    a_user: await registration_info.findOne({user_id:req.user.user_id}),
    b_user: await registration_info.findOne({user_id:req.params.user_id}),
    c_user:get_data,
    houseOwnerId:req.params.user_id,
    user_review:await user_review.find({reviewGivenTo:get_data._id})
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
  var price = req.body.price
  if(req.body.discount!=0){
    var x = (req.body.price*req.body.discount)/100
    price = (req.body.price-x)
  }
  var data = {
      post_id:get_data.counter,
      name:req.body.house_name,
      location:req.body.location,
      price:price,
      discount:req.body.discount,
      description:req.body.description,
      picture:req.body.house_name +'-'+ get_data.username+'-'+get_data.email+'-'+ get_data.counter,
      uploaderName:get_data.username,
      uploaded_by:get_data._id,
      uploader_id:user_id,
      uploader_type:get_data.user_type,
      uploader_phone:get_data.phone_number,
      uploader_rating:get_data.rating,
      for:get_data.user_type,
      bkashNumber:req.body.bkashNumber, 
      ownerBankAccountNumber:req.body.ownerBankAccountNumber,
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
    houses: await house_info.find({uploaded_by:id}),
    user:req.user,
    a_user: await registration_info.findOne({user_id:req.user.user_id})
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
    user:req.user,
    c_user:user,
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
    user:req.user,
    facebook_id:user.facebook_id
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
    address:req.body.address,
    facebook_id:req.body.facebook_id,
  };
  await registration_info.findOneAndUpdate(filter,update)
  res.redirect(`/users/${user_id}`)

}

const paymentPage = async(req,res)=>{
  const house = await house_info.findOne({post_id:req.params.post_id})
  const houseOwner = await registration_info.findOne({_id:house.uploaded_by})
  data = {
    user:req.user,
    post_id:req.params.post_id,
    payMethod:req.body.payMethod,
    house:house,
    houseOwner:houseOwner,

  }
  res.render('paymentPage',data)
}

const payment = async(req,res)=>{
  var houseOwner = await registration_info.findOne({_id:req.body.houseOwnerId})
  var customer = await registration_info.find({user_id:req.user.user_id})

  //Review
  var reviewText = req.body.review
  reviewData = {
    reviewGivenTo:houseOwner._id,
    reviewGivenBy:customer[0]._id,
    reviewGiverName:customer[0].username,
    reviewText:reviewText,
  }
  await user_review.insertMany([reviewData])

  var payMethod = req.body.payMethod
  var house = await house_info.findOne({_id:req.body.houseId})
  var emailText = `username:${req.user.username} user ID:${req.user.user_id}, Bank account number is: ${req.body.bankId},
  for house:${house.name}, price:${house.price} Taka 
  Please verify the transaction and confirm it from your housing portal account.`
  if (payMethod=="Owner Bkash Number"){
    var emailText = `username:${req.user.username} user ID:${req.user.user_id}, Bkash trx number is: ${req.body.trx}. 
    for house:${house.name}, price:${house.price} Taka 
    Please verify the transaction and confirm it from your housing portal account.`
  }
  const emailFrom = "md.isa.sayek.huda@g.bracu.ac.bd"
  

  if (Number(req.body.rating)!="none"){ // calculating seller/renter rating
    var ratingCount = houseOwner.ratingCount+1
    var rating = houseOwner.rating
    rating = ((rating+Number(req.body.rating))/ratingCount)

    await registration_info.findOneAndUpdate({email:houseOwner.email},{rating:rating,ratingCount:ratingCount})
    await house_info.findOneAndUpdate({uploaded_by:houseOwner._id},{uploader_rating:rating})

  }

  const emailTO = `${houseOwner.email}`

  await house_info.findOneAndUpdate({_id:house._id},{status:"pending confirmation",soldTo:req.user.user_id})
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: `${emailFrom}`, // replace with your actual Gmail email address
      pass: "vihmyswmqrtxitpj" // replace with your actual Gmail email password
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Housing Portal" <${emailFrom}>`, // sender address
    to: `${emailTO}`, // list of receivers
    subject: "Housing Portal", // Subject line
    text: `${emailText}`, // plain text body
    html: `<b>${emailText}</b`, // html body
  });
  res.redirect(`/users/${req.user.user_id}`);

}
const houseHistory = async(req,res)=>{
  var houses = await house_info.find({})
  var users = await registration_info.find({})
  for (house in houses ){
    for (user in users){
      if (houses[house].uploaded_by==users[user]._id){
        var update = {
          uploaderName:users[user].username,
          uploader_phone:users[user].phone_number,
          uploader_rating:users[user].rating,
        }
        await house_info.findOneAndUpdate({_id:houses[house]._id},update)
      }
      
        
    }
  }
  data = {
    user:req.user,
    houses: await house_info.find()
  }
  res.render('houseHistory',data)
    
}

const dealConfirm = async(req,res)=>{
  var house = await house_info.findOne({post_id:req.params.post_id})
  var emailText = `Congratulation on your purchase of the house named:${house.name} from ${house.uploaderName}`
  const emailFrom = "md.isa.sayek.huda@g.bracu.ac.bd"
  var houseSoldTo = await registration_info.findOne({user_id:house.soldTo})
  const emailTO = `${houseSoldTo.email}`
  await house_info.findOneAndUpdate({_id:house._id},{status:"unavailable"})
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: `${emailFrom}`, // replace with your actual Gmail email address
      pass: "vihmyswmqrtxitpj" // replace with your actual Gmail email password
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Housing Portal" <${emailFrom}>`, // sender address
    to: `${emailTO}`, // list of receivers
    subject: "Housing Portal", // Subject line
    text: `${emailText}`, // plain text body
    html: `<b>${emailText}</b`, // html body
  });
  res.redirect('/');
}
const dealDelete = async(req,res)=>{
  var house = await house_info.findOne({post_id:req.params.post_id})
  await house_info.findOneAndUpdate({_id:house._id},{status:"Available",soldTo:''})
  res.redirect(`/users/${req.user.user_id}/houseHistory`)
}
module.exports = {
  userPage,
  home,
  contactUsPage,
  contactUsPost,
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
  payment,
  houseHistory,
  dealConfirm,
  dealDelete,
}