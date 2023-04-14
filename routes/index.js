var express = require('express');
var router = express.Router();
var {auth2}= require('../middlewares/authorize')
const userController = require('../controllers/userController')
/* GET home page. */


router.route('/')
        .get(auth2, userController.home);

module.exports = router;
