var registration_info = require('../model/usersdb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret_key = 'secret'


const signUpPage = (req, res) => {
  res.render('sign_up');
}

const signUpProcess = async(req, res) => {
  try {
    var customUserId = await registration_info.count()
    customUserId+=1
    var checkUser = await registration_info.findOne({email:req.body.email})
    if (!checkUser ){
      var password = req.body.password
      var hash = bcrypt.hashSync(password, 5);

      data = {
        email:req.body.email,
        username:req.body.username,
        password:hash,
        user_type:req.body.user_type,
        user_id:customUserId,
        phone_number:req.body.phone_number,
        address:req.body.address,
        facebook_id:req.body.facebook_id,
      }
      await registration_info.insertMany([data]);

      res.redirect('/login')

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
      res.render('login'); // rendering login page
    
  } catch (er) {
    console.log(er)
  }
  
};

const loginAuth =  async (req,res) => {
  try {
    

    var email = req.body.email
    var user = await registration_info.findOne({email:email})
    var password = req.body.password
    if (user!=null){
      var check = await bcrypt.compare(password, user.password);
    }
    
    if (check==true){ // password authentication
      if (user.approval===true){  // approved by admin
        payload = { // plain data of the token
          email:user.email,
          username:user.username,
          _id:user._id,
          user_type:user.user_type,
          phone_number:user.phone_number,
          address:user.address,
          user_id:user.user_id,
          approval:user.approval,
          bankAccountNumber:user.bankAccountNumber,
        }
        var token = jwt.sign(payload,secret_key,{ expiresIn: '1h' })
        res //sending the client token as cookie
          .cookie('access_token', 'Bearer ' + token, {
          expires: new Date(Date.now() + 1 * 3600000) })
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
