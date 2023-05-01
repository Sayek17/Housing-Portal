var express = require('express');
var router = express.Router();

var registration_info = require('../model/usersdb');
var userController = require('../controllers/userController');
var {auth,auth2} = require('../middlewares/authorize');
//multer
var storage = userController.storage
var multer = require('multer');
var upload = multer({storage:storage});

/* GET users listing. */


router.route('/:user_id')
    .get(auth,userController.userPage);

router.route('/:user_id/contactUs')
    .get(auth,userController.contactUsPage)
    .post(auth,userController.contactUsPost);

router.route('/:user_id/logout')
    .get(userController.logout);
    
router.route('/:user_id/edit')
    .get(auth,userController.profileEdit)
    .post(auth,userController.updateProfile);    

router.route('/:user_id/posts')
    .get(auth,userController.postsPage)
    .post(auth,upload.single('house_pic'), userController.houseUpload);

router.route('/:user_id/houseHistory')
    .get(auth,userController.houseHistory);

router.route('/:user_id/posts/:post_id')
    .get(auth,userController.postDetails);

router.route('/:user_id/posts/:post_id/payment')
    .post(auth,userController.paymentPage);

router.route('/:user_id/:post_id/payment')
    .post(auth,userController.payment);



router.route('/:user_id/posts/:post_id/edit')
    .get(auth,userController.postEdit)
    .post(auth,userController.postUpdate);

router.route('/:user_id/posts/:post_id/delete')
    .get(auth,userController.postDelete);

router.route('/:user_id/posts/:post_id/dealConfirm')
    .get(auth,userController.dealConfirm);

router.route('/:user_id/posts/:post_id/dealDelete')
    .get(auth,userController.dealDelete);


module.exports = router;
