var express = require('express');
var router = express.Router();
var collection = require('../model/mongodb');
/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login',);
});

router.post('/', async (req,res)=>{
  try{
    const check = await collection.findOne({email:req.body.email})
    if (check.password===req.body.password){
      res.render('users',{name:check.username,email:check.email,type:check.user_type})
    }
    else{
      res.send('wrong password')
    }

  }
  catch {
    res.send('wrong details')
  }
})

module.exports = router;
