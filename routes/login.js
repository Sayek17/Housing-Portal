var express = require('express');
var router = express.Router();
var userController = require('../controllers/registrationController');
/* GET login page. */

router.route('/')
    .get(userController.loginPage)
    .post(userController.loginAuth);

module.exports = router;
