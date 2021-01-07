const jwt = require('jsonwebtoken')
module.exports = function makeJWT({_id, username}){
    const payload = {
        _id, 
        username
    };
    const config = {
        jwtsecret : process.env.JWT_SECRET || 'is it safe or are you exposed which is it?!'
    };
    return jwt.sign(payload, config.jwtsecret); 
}