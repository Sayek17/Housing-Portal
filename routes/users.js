var express = require('express');
var router = express.Router();

var registration_info = require('../model/usersdb');
var userController = require('../controllers/userController');
var {auth} = require('../middlewares/authorize');
//multer
var storage = userController.storage
var multer = require('multer');
var upload = multer({storage:storage});

/* GET users listing. */
router.route('/:user_id',)
    .get(auth,userController.userPage)
    
    
router.route('/:user_id/edit')
    .get(auth,userController.profileEdit)
    .post(auth,userController.updateProfile);
    


router.route('/:user_id/posts')
    .get(auth,userController.postsPage)
    .post(auth,upload.single('house_pic'), userController.houseUpload);

module.exports = router;
