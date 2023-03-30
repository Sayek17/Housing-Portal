var express = require('express');
var router = express.Router();
var userController = require('../controllers/registrationController');
/* GET login page. */
// router.use(express.json())

// router.use(express.urlencoded({ extended: false }))

router.route('/')
    .get(userController.loginPage)
    .post(userController.loginAuth);

module.exports = router;
