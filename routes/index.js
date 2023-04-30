var express = require('express');
var router = express.Router();
var {auth2,auth}= require('../middlewares/authorize')
const userController = require('../controllers/userController')
/* GET home page. */


router.route('/')
        .get(auth,userController.home);

module.exports = router;
