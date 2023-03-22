var express = require('express');
var router = express.Router();
var collection = require('../model/mongodb');


//database connection


// new setup
router.use(express.json())

router.use(express.urlencoded({ extended: false }))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('sign_up',);
});


router.post('/',  async(req, res)=>{
  var data ={
    email:req.body.email,
    username:req.body.username,
    password:req.body.password,
    user_type:req.body.user_type
  };
  await collection.insertMany([data]);

  res.render('index');
});

module.exports = router;
