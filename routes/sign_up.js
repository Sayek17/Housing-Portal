var express = require('express');
var router = express.Router();
var registrationController = require('../controllers/registrationController');


/* GET home page. */

router.route('/')
  .get(registrationController.signUpPage)
  .post(registrationController.signUpProcess);

module.exports = router;