const express = require('express');
const app = express(); 
const path = require('path'); 
const weatherRoute = require('./routes/weatherRoute.js');
const authRouter = require('./auth/authRouter.js'); 
const favoriteRouter = require('./routes/updateFavorites.js')
const { json } = require('express');
app.use(json());


app.use('/weather', weatherRoute);
app.use('/favorite', favoriteRouter);
app.use('/auth' , authRouter); 

app.get('/app.js', (req,res)=>{
    res.sendFile(path.join(`${__dirname}/public/app.js`));
});

app.get('/login.js', (req,res)=>{
    res.sendFile(path.join(`${__dirname}/public/login.js`));
});

app.get('/login.html', (req,res)=>{
    res.sendFile(path.join(`${__dirname}/public/login.html`));
});

app.get('/', (req,res)=>{
    res.sendFile(path.join(`${__dirname}/public/index.html`)); 
});




const port = process.env.port || 3000; 
app.listen(port, ()=>{
    console.log(`server on [${port}]`); 
});