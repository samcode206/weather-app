const {Router} = require('express'); 
const router = Router();
const axios = require('axios'); 
const getFormatedData = require('../utils/getFormattedData.js'); 

router.get('/:zip', async (req, res) =>{
    try {
    const {zip} = req.params; 
    const {data} = await axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=655dfc390726be35679ee1f171b45301`);
    const massagedData =  await getFormatedData(data);
    res.status(200).json(massagedData); 
    }
    catch (err){
        res.status(500).json({message : "please enter a vaild zip code"}); 
    }
});

module.exports = router; 