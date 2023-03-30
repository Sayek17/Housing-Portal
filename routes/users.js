var express = require('express');
var router = express.Router();

var registration_info = require('../model/usersdb');
var userController = require('../controllers/userController');

//multer
var storage = userController.storage
var multer = require('multer');
var upload = multer({storage:storage});

/* GET users listing. */
router.route('/:user_id')
    .get(userController.userPage)
    
    
router.route('/:user_id/edit')
    .get(userController.profileEdit)
    .post(userController.updateProfile);
    


router.route('/:user_id/posts')
    .get(userController.postsPage)
    .post(upload.single('house_pic'), userController.houseUpload);

module.exports = router;
