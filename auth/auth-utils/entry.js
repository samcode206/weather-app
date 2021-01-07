const {User} = require('../../db.js');
const bcryptjs = require('bcryptjs'); 
const makeJWT = require('./makeJWT'); 

const register = async (req, res)=>{
  if (typeof req.body.password === 'string' && typeof req.body.username === 'string'){
    try {
         const body = req.body; 
         const hash = bcryptjs.hashSync(body.password, 4);
         // set the body to the hash result 
         body.password = hash; 
         const user = await User.create(body); 
         const token = makeJWT(user); 
        res.status(200).json({user, token});
    }catch(err){
        res.status(500).json({message: err.message}); 
    }
    } else {
        res.status(400).json({message : "please provide a username & password!"}); 
    }
};


const login = async (req, res) =>{
    const {username , password} = req.body; 
    if (!username || !password) res.status(401).json({message: "please enter username and password"}); 
    const user = await User.findOne().where('username').equals(username); 
    if (user.password  && bcryptjs.compareSync(password, user.password)){
        const token = makeJWT(user); 
        res.status(200).json({token, username : user.username, favorites : user.favorites}); 
    } else {
        res.status(401).json({message: 'invalid credentials!'}); 
    }
}; 



module.exports = {
    register, 
    login
}