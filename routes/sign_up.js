var express = require('express');
var router = express.Router();
var userController = require('../controllers/registrationController');

// new setup
// router.use(express.json())
// router.use(express.urlencoded({ extended: false }))
/* GET home page. */

router.route('/')
  .get(userController.signUpPage)
  .post(userController.signUpProcess);

module.exports = router;
