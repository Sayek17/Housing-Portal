var registration_info = require('../model/usersdb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret_key = 'secret'


const signUpPage = (req, res) => {
  res.render('sign_up');
}

const signUpProcess = async(req, res) => {
  try {
    var count = await registration_info.count()
    count+=1
    var checkUser = await registration_info.findOne({email:req.body.email})
    if (!checkUser ){
      var password = req.body.password
      var hash = bcrypt.hashSync(password, 5);

      data = {
        email:req.body.email,
        username:req.body.username,
        password:hash,
        user_type:req.body.user_type,
        user_id:count,
        phone_number:req.body.phone_number,
        address:req.body.address,
        token:'temp-token'
      }
      await registration_info.insertMany([data]);
      id = await registration_info.findOne({email:req.body.email})
      payload = {
        email:req.body.email,
        username:req.body.username,
        Id:id._id,
        user_id:id.user_id,
        approval:id.approval,
      }
      token = jwt.sign(payload,secret_key)
      await registration_info.findOneAndUpdate({_id:id},{token:token})
      res
         .cookie('access_token', 'Bearer ' + token, {
        expires: new Date(Date.now() + 1 * 3600000) 
      })
         .redirect('/')
    }
    else{
      res.send('user already exists, try a new email')
    }
  } catch (error) {
    console.log(error)
  }
}


const loginPage = (req, res) => {
  try {
    var token = req.cookies
    if ('access_token' in token){
      token = token.access_token.split(' ')[1]
      var decoded = jwt.verify(token, secret_key)
      if (decoded.approval===true){
        res.redirect(`/users/${decoded.user_id}`);
      }
      else {
        res.send('Account not approved yet by the admin')
      } 
      
    } else {
      res.render('login');
    }
  } catch (er) {
    console.log(er)
  }
  
};

const loginAuth =  async (req,res) => {
  try {
    
    try {
      var email = req.body.email
      var user = await registration_info.findOne({email:email})
      var password = req.body.password
      var check = await bcrypt.compare(password, user.password);
    } catch (error) {
      res.send('wrong credential')
    }
 
    if (check==true){
      payload = {
        email:user.email,
        username:user.username,
        Id:user._id,
        user_id:user.user_id,
        approval:user.approval
      }
      var token = jwt.sign(payload,secret_key,{ expiresIn: '1h' })
      await registration_info.findOneAndUpdate({email:user.email},{token:token})
      if (user.approval===true){
        res
          .cookie('access_token', 'Bearer ' + token, {
          expires: new Date(Date.now() + 1 * 3600000) 
        })
          .redirect(`/users/${user.user_id}`);
      }
      else {
        res.send('Account not approved yet by the admin')
      } 

    }
    else{
      res.send('wrong credential')
    }

  } catch (er) {
    console.log(er)
  }
}


module.exports = {loginPage, loginAuth, signUpPage, signUpProcess};
