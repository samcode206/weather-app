const axios = require('axios'); 

module.exports = async =  async (
    {coord : {lat},
     coord : {lon},
     weather,
     main : {humidity, pressure, temp},
    wind : {speed}
}) => {
    try{
        const url = `https://us1.locationiq.com/v1/reverse.php?key=pk.edc3e7fa4ae3bbefd98f8b041c72fdef&lat=${lat}&lon=${lon}&format=json`; 
        const {data : {address : {city, state }}} = await axios.get(url); 
        const massaged = {
        location : `${city} ${state}`,
        weather : weather[0]['main'],
        humidity : `${humidity}%`, 
        wind : speed,
        Precipitation : `${Math.floor(pressure / humidity)}%`,
        temp

    };  
     return massaged;
    }catch (err){
        throw new Error(err.message); 
    }
}; 