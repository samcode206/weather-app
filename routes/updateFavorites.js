const express = require('express'); 
const router = express.Router();
const {User} = require('../db.js'); 
const authorize = require('../auth/auth-utils/auth-midware.js'); 



router.post('/',authorize,  async (req, res)=>{
    const username = req.body.username;
    const zipcode = req.body.zipcode; 
    const location = req.body.location; 
    const user = await User.findOne().where('username').equals(username);
    user.favorites.push({
        zipcode, 
        location
    });
    res.status(200).json(user.favorites); 
    user.save((err)=>{
        if (err) console.log(err); 
        console.log('Saved !'); 
    })
});


router.delete('/', authorize,  async (req,res)=>{
    const username = req.body.username;
    const id = req.body.id; 
    const user = await User.findOne().where('username').equals(username);
    user.favorites.pull({_id: id}); 
      user.save((err)=>{
        if (err) console.log(err); 
        console.log('Saved !'); 
    })
     res.status(200).json(user.favorites); 
});

module.exports = router;