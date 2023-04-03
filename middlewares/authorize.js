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

module.exports = {auth};