express = require('express');
router = express.Router();
const {register, login} = require('./auth-utils/entry');

router.post('/register', async (req,res)=>{
   register(req, res); 
});

router.post('/login', async (req,res)=>{
   login(req, res); 
});

module.exports = router;