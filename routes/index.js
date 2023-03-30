var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
/* GET home page. */


router.get('/', userController.home);

module.exports = router;
