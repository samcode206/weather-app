// DOM stuff 
const addFavoriteBtn = document.getElementById('add-favorites'); 
const searchZipCodevalue = document.getElementById('zipValue');
const searchBtn = document.getElementById('search'); 
const form = document.querySelector('.form-inline');
const place = document.querySelector('#location'); 
const temp = document.querySelector("#temp"); 
const weather = document.querySelector("#weath"); 
const pressure = document.querySelector("#pressure"); 
const humidity = document.querySelector("#humidity"); 
const wind = document.querySelector("#wind"); 
const favoriteBtn = document.querySelector('.btn-primary');


// application state 
let state = {
    currentWeather : {}, 
    favorites : [],
    token : '',
    username : ''
};
// retrieve from local storage the token and update the DOM 


// fetching the weather from our api 
const fetchWeather = async (zipcode) =>{
    try {
    const baseUrl = `${window.location.origin}/weather/`; 
    if (zipcode && zipcode.length === 5){
        const response = await fetch(baseUrl+zipcode);
        const data = await response.json();
        updateCard(data); 
        state.currentWeather = {location : data.location , zipcode}; 
    }
    }
    catch(err){
        throw new Error(err.message); 
    }
}; 
 
// updating the card 
const updateCard = (data) =>{
    if (!data.message){
    place.innerText = data.location; 
    temp.innerText = `${Math.floor(data.temp  * (9/5) -  459.67)}°`;
    weather.innerText = data.weather;
    pressure.innerText = `Pressure ${data.Precipitation}`;
    humidity.innerText = `Humidity ${data.humidity}`;
    wind.innerText = `Wind ${data.wind} MPH`;
   favoriteBtn.style.display = 'inline'; 
    } else {
        // let the user know they made a mistake
        place.innerText = 'please enter a proper Zipcode!';
        temp.innerText = ``;
        weather.innerText = '';
        pressure.innerText = ``;
        humidity.innerText = ``;
        wind.innerText = ``;
        favoriteBtn.style.display = 'none'; 
    }
};


// listening for user-input 
searchBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    // base url
    const zipcode = searchZipCodevalue.value; 
    fetchWeather(zipcode); 
   form.reset(); 
});


// listening for favorite button
addFavoriteBtn.addEventListener('click', (e)=>{
    e.preventDefault(); 
    // check if its in the favorites already if it is do nothing 
    if (checkExistanceAndAdd(state.currentWeather)){
        alert('item already exists')
        return;
    } else {
        appendNewFavorite(createFavorite(state.currentWeather));
    }
    
});

// checks if an item exists in the favorites already if not then it will add it 
const checkExistanceAndAdd = (current) =>{
    for (let report of state.favorites){
        if (report.zipcode === current.zipcode) return true; 
    }
    state.favorites.push(current); 
    postNewFavorite(state.username, current.zipcode, current.location); 
    // make a post request and refetch the data to the local storage 
    console.log(current);
    return false; 
};

// creates the favorite to be added 
const createFavorite = (content) =>{
    const anchor = document.createElement('a'); 
    const button = document.createElement('button'); 
    anchor.classList.add('list-group-item', 'list-group-item-action');
    anchor.href = '#'; 
    anchor.innerText = content.location; 
    anchor.id = content.zipcode; 
    button.classList.add('btn', 'btn-default');
    button.style = "display: inline; float: right;";
    button.innerText = 'X'; 
    button.id = content.zipcode + 'btn'; 
    anchor.appendChild(button); 
    return anchor;
}; 


// appends it to the parent node 
const appendNewFavorite = (newFavorite) =>{
    const list = document.querySelector('.list-group'); 
    list.appendChild(newFavorite); 
}; 

let list = document.querySelectorAll('.list-group'); 
list.forEach(city =>{
    city.addEventListener('click', (e)=>{
     if( e.target.id.indexOf('btn') === - 1 ) {
        // create a function to refetch that data
        fetchWeather(e.target.id);
     } else {
         // remove it 
         state.favorites = state.favorites.filter((report) =>report.zipcode !== e.target.parentElement.id);
         // make a post request to delete that item
         deleteFavorite(getFavoriteID(e.target.parentElement.id));
        e.target.parentElement.remove();
     }; 
    });
});


const retrieveLocalStorage = () =>{
    if (localStorage.getItem('user')){
        // this show that the user is logged in 
        const data = JSON.parse(localStorage.getItem('user')); 
        state.favorites = data.favorites; 
        state.username = data.user; 
        state.token = data.token;
        state.favorites.forEach(favorite =>{
            appendNewFavorite(createFavorite(favorite));
        });
        const logout = document.querySelector('.loginBtn');
        logout.innerText = 'Log Out'; 
        logout.style = 'color : red;'
        logout.href = '#'; 

    }else{
        // this show that the user is logged out 
         const logout = document.querySelector('.loginBtn');
        logout.innerText = 'Login'; 
        logout.style = 'color : green;'
        logout.href = '/login.html'; 
    }
}; 

function removeLocalStorage(data){
     let oldLocalStorage = JSON.parse(window.localStorage.getItem('user'));
        oldLocalStorage.favorites = data; 
       window.localStorage.setItem('user', JSON.stringify(oldLocalStorage)); 
};

function getFavoriteID(id){
    const oldLocalStorage = JSON.parse(window.localStorage.getItem('user'));
    let favId = oldLocalStorage.favorites.filter((item) => item.zipcode === id);
    return favId[0]._id
}; 

function addLocalSorage(data){
        const oldLocalStorage = JSON.parse(window.localStorage.getItem('user'));
        oldLocalStorage.favorites.push(data[data.length - 1]);
       window.localStorage.setItem('user', JSON.stringify(oldLocalStorage)); 
}; 

function postNewFavorite(username , zipcode , location){
     fetch(`${window.location.origin}/favorite`, {
             method: 'POST',
             headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : state.token
                    },
            body: JSON.stringify({
                // provide username zipcode and location   
                username,
                zipcode,
                location
            })
            })
             .then((response) => response.json())
             //Then with the data from the response in JSON...
             .then((data) => {
             addLocalSorage(data); 
            })
             //Then with the error genereted...
            .catch((error) => {
            console.error('Error:', error);
          });
};

function deleteFavorite(id){
    // provide id and username
     fetch(`${window.location.origin}/favorite`, {
             method: 'DELETE',
             headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : state.token
                    },
            body: JSON.stringify({
                // provide username zipcode and location   
                username : state.username,
                id
            })
            })
             .then((response) => response.json())
             //Then with the data from the response in JSON...
             .then((data) => {
             removeLocalStorage(data); 
            })
             //Then with the error genereted...
            .catch((error) => {
            console.error('Error:', error);
          });
}; 

const entry = document.querySelector('.loginBtn'); 

entry.addEventListener('click' , ()=>{
    if (entry.innerText === 'Log Out'){
        console.log('log user out')
        window.localStorage.removeItem('user'); 
        window.location.reload();
    }
})

retrieveLocalStorage();
