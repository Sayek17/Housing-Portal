const jwt = require('jsonwebtoken');
const secret_key = 'secret'


const auth = function(req,res,next){
    try {
        var token = req.cookies
        token = token['access_token'].split(' ')[1]
        req.user = jwt.verify(token,secret_key) // decrypting the token and passing it to req object
        next()
    } catch (error) {
        if (req.path=='/'){
            next()
        }
        else{
            res.send('Unauthorized User')
        }
        
    }
};


module.exports = {auth};