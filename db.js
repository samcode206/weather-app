const mongoose = require('mongoose');


mongoose.connect(`mongodb+srv://sameem:hj7dH1xgvA2bORAW@cluster0.sh8s9.mongodb.net/<dbname>?retryWrites=true&w=majority`,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
});

const db = mongoose.connection; 

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', ()=>{
    console.log('connection success!'); 
});

const favoriteSchema = new mongoose.Schema({
    zipcode : {type:String , required : true}, 
    location : {type: String, required : true}
}); 

const userSchema = new mongoose.Schema({
    username : {type: String, required : true, unique: true},
    password : {type : String , required : true}, 
    favorites : [favoriteSchema]
});

const User = mongoose.model('user' , userSchema); 

module.exports = { 
    User
}