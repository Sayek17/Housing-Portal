const jwt = require('jsonwebtoken');
const secret_key = 'secret'


const auth = function(req,res,next){
    try {
        var token = req.cookies
        token = token['access_token'].split(' ')[1]
        req.user = jwt.verify(token,secret_key)
        next()
    } catch (error) {
        res.send('unauthorized user')
    }
};

const auth2 = function(req,res,next){
    console.log()
    try {
        var token = req.cookies

        token = token['access_token'].split(' ')[1]
        req.user = jwt.verify(token,secret_key)
        next()
    } catch (error) {
        console.log(error)
        next()
    }
};

module.exports = {auth,auth2};