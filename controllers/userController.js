var registration_info = require('../model/usersdb');

// exports.engine = 'html';

// sign up
const signUpPage = (req, res) => {
  res.render('sign_up',);
}

const signUpProcess = async(req, res) => {
  var data ={
    email:req.body.email,
    username:req.body.username,
    password:req.body.password,
    user_type:req.body.user_type
  };
  await registration_info.insertMany([data]);

  res.render('index');
}

// login
const loginPage = (req, res) => {
  res.render('login');
};

const loginAuth =  async (req,res, next) => {
    try{
      const check = await registration_info.findOne({email:req.body.email})
      if (check.password===req.body.password){
        res.render('users',{name:check.username,email:check.email,type:check.user_type})
      }
      else{
        res.send('wrong password')
      }} catch {
        res.send('wrong details')
      }
  };

module.exports = {loginPage, loginAuth, signUpPage, signUpProcess};