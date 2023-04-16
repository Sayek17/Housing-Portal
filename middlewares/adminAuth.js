const admin_info = require('../model/admindb');
var jwt = require('jsonwebtoken');
var secret_key = 'secret'

const adminAuth = async (req,res,next) => {
    try {
        var token = req.cookies.access_token_admin
        token = token.split(' ')[1]
        var decoded = jwt.verify(token,secret_key)

        var admin = await admin_info.findOne({username:decoded.username})

        if (decoded.username==admin.username && decoded.password==admin.password){
            next()
        }
        else{
            res.render('admin_login')
        }

    } catch (error) {
        res.render('admin_login')
    }

}

module.exports = {adminAuth}