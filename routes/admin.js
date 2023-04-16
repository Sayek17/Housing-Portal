var express = require('express');
var router = express.Router();
var adminControllers = require('../controllers/adminControllers');
var {adminAuth} = require('../middlewares/adminAuth');

router.route('/')
    .get(adminAuth,adminControllers.adminPage)
    .post(adminControllers.adminAuthenticate)

router.route('/:user_id/:what')
    .get(adminAuth,adminControllers.admin_user_approval)

router.route('/logout')
    .get(adminControllers.adminLogout)
module.exports = router;