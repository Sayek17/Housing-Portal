var express = require('express');
var router = express.Router();
var registrationController = require('../controllers/registrationController');
/* GET login page. */

router.route('/')
    .get(registrationController.loginPage)
    .post(registrationController.loginAuth);

module.exports = router;
