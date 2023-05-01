const admin_info = require('../model/admindb');
const registration_info = require('../model/usersdb');
const house_info = require('../model/housedb');

var jwt = require('jsonwebtoken');
var secret_key = 'secret'

const adminPage = async function (req,res) {
    var users = await registration_info.find({})
    var houses = await house_info.find({})
    data = {
        users:users,
        houses:houses
    }
    res.render('adminPage',data)
}

const adminAuthenticate = async (req,res) => { // creating admin profile
    data = {
        username:'isa',
        password:1234,
    }
    var check = await admin_info.findOne({username:data.username})

    if (check==undefined){
        await admin_info.insertMany([data])
    }
    payload = { // creating token info
        username:data.username,
        password:data.password,
    }
    var admin = await admin_info.findOne({username:payload.username})

    if (req.body.username==admin.username && req.body.password==admin.password){
        var token = jwt.sign(payload,secret_key)
        var users = await registration_info.find({})
        var houses = await house_info.find({})

        data = {
            users:users,
            houses:houses
        }
        res
            .cookie('access_token_admin', 'Bearer ' + token, {
            expires: new Date(Date.now() + 1 * 3600000)}) // cookie will be removed after 8 hours
            .render('adminPage',data)
    }
    else{
        res.send('Wrong Credentials')
    }
    
}

const adminLogout = async (req,res)=>{
    res
        .clearCookie('access_token_admin')
        .redirect('/admin')
}

const admin_user_approval = async (req,res) =>{
    var user_id = req.params.user_id
    var what = req.params.what
    if (what==="approve"){
        await registration_info.findOneAndUpdate({user_id:user_id},{approval:true})

        res.redirect('/admin')
    } else if (what==="revoke") {
        await registration_info.findOneAndUpdate({user_id:user_id},{approval:false})
        res.redirect('/admin')
    } else if (Number(what)){// if what == numeric then its a post
        await house_info.findOneAndUpdate({post_id:what,uploader_id:user_id},{approval:true})
        res.redirect('/admin')
    }

}

const admin_post_remove = async (req,res)=>{
    await house_info.findOneAndUpdate({post_id:req.params.post_id,uploader_id:req.params.user_id},{approval:false})
    res.redirect('/admin')
}
module.exports = {
    adminPage,
    adminAuthenticate,
    adminLogout,
    admin_user_approval,
    admin_post_remove,
}