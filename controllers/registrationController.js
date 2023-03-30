var registration_info = require('../model/usersdb');


// sign up
const signUpPage = (req, res) => {
  res.render('sign_up');
}

const signUpProcess = async(req, res) => {

  var count = await registration_info.count()
  count+=1
  var data ={
    email:req.body.email,
    username:req.body.username,
    password:req.body.password,
    user_type:req.body.user_type,
    user_id:count
    
  };
  await registration_info.insertMany([data]);

  

  res.render('login');
}

// login
const loginPage = (req, res) => {
  res.render('login');
};

const loginAuth =  async (req,res, next) => {
    try{
      const check = await registration_info.findOne({email:req.body.email})
      if (check.password===req.body.password){

        var user_id = check.user_id
        res.redirect(`/users/${user_id}`)
      }
      else{
        res.send('wrong password')
      }} catch {
        res.send('wrong details')
      }
  };

module.exports = {loginPage, loginAuth, signUpPage, signUpProcess};